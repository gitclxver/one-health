package com.example.BlogAPI.Security.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecretBase64;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationInMs;

    @Value("${app.jwt.issuer:BlogAPI}")
    private String jwtIssuer;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretBase64);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(email)
                .issuer(jwtIssuer)
                .issuedAt(now)
                .expiration(expiration)
                .claim("role", role)
                .signWith(signingKey)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) throws JwtException {
        return getClaims(token).getSubject();
    }

    public Date getExpirationDateFromToken(String token) throws JwtException {
        return getClaims(token).getExpiration();
    }

    public long getRemainingValidityInMs(String token) throws JwtException {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.getTime() - System.currentTimeMillis();
    }

    public String getRoleFromToken(String token) throws JwtException {
        return getClaims(token).get("role", String.class);
    }

    private Claims getClaims(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String refreshToken(String token) throws JwtException {
        Claims claims = getClaims(token);
        Date now = new Date();
        Date newExpiration = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(claims.getSubject())
                .issuer(jwtIssuer)
                .issuedAt(now)
                .expiration(newExpiration)
                .claim("role", claims.get("role"))
                .signWith(signingKey)
                .compact();
    }
}