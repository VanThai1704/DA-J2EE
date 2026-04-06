package DAJ2EE.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "useraddresses")
public class UserAddress extends BaseEntity {

    // Kept as primitive FK for existing services/controllers
    @Column(name = "user_id")
    private Long userId;

    // Optional relation for newer codepaths
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @Column(length = 150)
    private String receiverName;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    // Backward-compatible naming from older DTOs
    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String district;

    @Column(nullable = false)
    private Boolean isDefault = false;
}
