package DAJ2EE.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "role_permissions")
@Table(name = "role_permissions")
@Data
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;
}
