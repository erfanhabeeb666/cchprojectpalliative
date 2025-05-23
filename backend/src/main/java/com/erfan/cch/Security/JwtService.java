package com.erfan.cch.Security;


import com.erfan.cch.Models.User;
import com.erfan.cch.Services.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {
    private static final String SECRET_KEY = "4e8e3a7215d4834a0bfade46cf9b9134104f2be3fea31faee6fbb54ad4fd4761";
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);


    public JwtService(UserService userService) {
        this.userService = userService;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractId(String token) {
        Claims claims = extractAllClaims(token);
        logger.debug("Claims extracted from JWT: {}", claims);
        return claims.getId();
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        extraClaims.put("userType", user.getUserType().name());
        extraClaims.put("userId", user.getId());

        return Jwts.builder()
                        .setClaims(extraClaims)
                        .setId(userService.getIdfromUsername(userDetails.getUsername()))
                        .setSubject(userDetails.getUsername())
                        .setIssuedAt(new Date(System.currentTimeMillis()))
                        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
//                .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*24*360)) for testing todo
                        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                        .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}