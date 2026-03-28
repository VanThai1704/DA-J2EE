package DAJ2EE.service.Auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import DAJ2EE.entity.User;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    // The key must be at least 256 bits (32 characters) for HS256
    private static final String SECRET_STRING = "secret_key_daj2ee_backend_springboot_must_be_at_least_32_bytes";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("id", user.getId())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12)) // 12 hours expiry
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
