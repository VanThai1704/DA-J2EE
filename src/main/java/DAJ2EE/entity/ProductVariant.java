package DAJ2EE.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity(name = "productvariants")
@Table(name = "productvariants")
@Data
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color color;

    @Column(name = "size_id")
    private Long sizeId;

    private Double price;

    private Integer stock;

    private String sku;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
