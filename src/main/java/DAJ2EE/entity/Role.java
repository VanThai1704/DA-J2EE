package DAJ2EE.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity(name = "roles")
@Table(name = "roles")
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
