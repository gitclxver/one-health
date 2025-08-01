package com.example.BlogAPI.Security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.User;

import javax.crypto.SecretKey;
import java.util.Date;

public class jwtUtil {
    public static String generateToken(User user){
        return Jwts
                .builder()
                .subject(user.getUsername())
                .claim("role", user.getAuthorities().iterator().next().getAuthority())
                .expiration(new Date(System.currentTimeMillis()+300_000))
                .signWith(getSigningKey())
                .compact();
    }

    public static Claims getClaims(String token){
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public static boolean isTokenValid(String Token){
        return !isExpired(Token);
    }

    private static boolean isExpired(String token) {
        return getClaims(token)
                .getExpiration()
                .before(new Date());
    }

    public static SecretKey getSigningKey(){
        byte[] keyBytes = Decoders.BASE64.decode("ThisistheSecretKeyEnjoyApparrentlyitshouldbelong");
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
