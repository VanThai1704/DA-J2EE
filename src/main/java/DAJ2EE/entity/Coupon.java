package DAJ2EE.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "coupons")
public class Coupon extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    /** 
     * PERCENTAGE or FIXED
     */
    @Column(nullable = false, length = 20)
    private String discountType = "FIXED";

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal discountValue;


    @Column(precision = 14, scale = 2)
    private BigDecimal minOrderValue;

    private Integer usageLimit;

    private Integer usedCount = 0;

    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private Boolean active = true;
}
