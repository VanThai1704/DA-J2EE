package DAJ2EE.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import DAJ2EE.enums.GenderEnum;
import jakarta.persistence.*;
import lombok.Data;
import jakarta. validation.constraints.*;
@Data
@Entity(name = "users")
@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Cần phải có tên đăng nhập")
    @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3 đến 50 ký tự")
    @Column(nullable = false, unique = true)
    private String username;

    @Email(message = "Email không hợp lệ")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Cần phải có mật khẩu")
    @Size(min = 6, message = "Mật khẩu phải ít nhất 6 ký tự")
    @Column(nullable = false)
    private String password;

    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;
    private String phone;
    private GenderEnum gender;
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
