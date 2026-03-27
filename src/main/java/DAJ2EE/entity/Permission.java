package DAJ2EE.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;
@Data
@Entity(name = "permissions")
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL)
    private Set<RolePermission> rolePermissions;
}
