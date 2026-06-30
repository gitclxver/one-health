import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { AuthRepository } from './auth.repository.js';
import { LoginDto, RegisterDto } from './dto/index.js';
import { DomainEvents } from '../../common/events/index.js';
import type { JwtPayload } from '../../common/interfaces/index.js';
import type { User } from '../../../generated/prisma/client.js';
import type { Role } from '../../common/enums/index.js';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult {
  user: Omit<User, 'passwordHash'>;
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.authRepository.findUserByEmail(dto.email);
    if (existing) throw new ConflictException('Email is already registered');

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.authRepository.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    this.logger.log(`New user registered: ${user.email}`);
    const tokens = await this.generateAndStoreTokens(user);

    this.eventEmitter.emit(DomainEvents.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
    });

    return { user: this.sanitizeUser(user), tokens };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('Account is disabled');

    await this.authRepository.updateLastLogin(user.id);
    const tokens = await this.generateAndStoreTokens(user);

    this.eventEmitter.emit(DomainEvents.USER_LOGGED_IN, {
      userId: user.id,
      email: user.email,
    });

    return { user: this.sanitizeUser(user), tokens };
  }

  async refresh(rawRefreshToken: string): Promise<TokenPair> {
    const tokenHash = await argon2.hash(rawRefreshToken);
    const stored = await this.authRepository.findRefreshToken(tokenHash);

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const user = await this.authRepository.findUserById(stored.userId);
    if (!user || !user.isActive) throw new UnauthorizedException('User not found or disabled');

    await this.authRepository.revokeRefreshToken(stored.id);
    return this.generateAndStoreTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.revokeAllUserRefreshTokens(userId);
  }

  private async generateAndStoreTokens(user: User): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    };

    const accessToken = this.jwtService.sign(payload);

    const rawRefreshToken = randomBytes(48).toString('hex');
    const tokenHash = await argon2.hash(rawRefreshToken);
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';
    const expiresAt = new Date(Date.now() + this.parseDuration(refreshExpiresIn));

    await this.authRepository.createRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _hash, ...rest } = user;
    return rest;
  }

  private parseDuration(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);
    const ms: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return value * (ms[unit] ?? 86_400_000);
  }
}
