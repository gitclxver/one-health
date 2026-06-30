import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service.js';
import { UploadMediaDto } from './dto/index.js';
import { multerUploadOptions } from './utils/file-filter.util.js';
import { Roles, CurrentUser } from '../../decorators/index.js';
import { Role } from '../../common/enums/index.js';
import type { AuthenticatedUser } from '../../common/interfaces/index.js';
import { ApiResponse } from '../../common/responses/index.js';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @UseInterceptors(FileInterceptor('file', multerUploadOptions))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponse<unknown>> {
    const media = await this.mediaService.upload(file, dto, user);
    return ApiResponse.ok('File uploaded', media);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<ApiResponse<unknown>> {
    const media = await this.mediaService.findAll(undefined, page, limit);
    return ApiResponse.ok('Media retrieved', media);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  async findOne(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const media = await this.mediaService.findOne(id);
    return ApiResponse.ok('Media retrieved', media);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.mediaService.remove(id, user);
  }
}
