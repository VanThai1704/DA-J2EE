package DAJ2EE.Controller;

import DAJ2EE.entity.Coupon;
import DAJ2EE.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    /** GET /api/coupons — list all coupons (admin) */
    @GetMapping
    public List<Coupon> getAll() {
        return couponRepository.findAll();
    }

    /** GET /api/coupons/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getById(@PathVariable Long id) {
        return couponRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** POST /api/coupons — create a new coupon (admin) */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Coupon coupon) {
        try {
            if (coupon.getCode() == null || coupon.getCode().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mã coupon không được để trống"));
            }
            if (couponRepository.findByCode(coupon.getCode().trim()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mã coupon đã tồn tại"));
            }
            coupon.setCode(coupon.getCode().trim().toUpperCase());
            if (coupon.getUsedCount() == null) coupon.setUsedCount(0);
            if (coupon.getActive() == null) coupon.setActive(true);
            Coupon saved = couponRepository.save(coupon);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/coupons/{id} — update a coupon (admin) */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Coupon body) {
        return couponRepository.findById(id).map(coupon -> {
            if (body.getCode() != null) coupon.setCode(body.getCode().trim().toUpperCase());
            if (body.getDiscountType() != null) coupon.setDiscountType(body.getDiscountType());
            if (body.getDiscountValue() != null) coupon.setDiscountValue(body.getDiscountValue());

            coupon.setMinOrderValue(body.getMinOrderValue());
            coupon.setUsageLimit(body.getUsageLimit());
            coupon.setExpiryDate(body.getExpiryDate());
            if (body.getActive() != null) coupon.setActive(body.getActive());
            return ResponseEntity.ok(couponRepository.save(coupon));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/coupons/{id} (admin) */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!couponRepository.existsById(id)) return ResponseEntity.notFound().build();
        couponRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa mã giảm giá #" + id));
    }

    /** POST /api/coupons/validate — validate coupon for checkout */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(@RequestBody Map<String, Object> body) {
        String code = body.getOrDefault("code", "").toString().trim();
        BigDecimal orderTotal = new BigDecimal(body.getOrDefault("orderTotal", "0").toString());

        Optional<Coupon> opt = couponRepository.findByCode(code);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mã giảm giá không tồn tại."));
        }

        Coupon coupon = opt.get();
        if (!Boolean.TRUE.equals(coupon.getActive())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mã giảm giá không còn hoạt động."));
        }

        if (coupon.getExpiryDate() != null && LocalDateTime.now().isAfter(coupon.getExpiryDate())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mã giảm giá đã hết hạn."));
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() != null
                && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mã giảm giá đã hết lượt sử dụng."));
        }

        if (coupon.getMinOrderValue() != null && orderTotal.compareTo(coupon.getMinOrderValue()) < 0) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Đơn hàng chưa đạt giá trị tối thiểu (" + coupon.getMinOrderValue() + "đ) để áp dụng mã này."));
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = orderTotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, java.math.RoundingMode.HALF_UP);
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        if (discountAmount.compareTo(orderTotal) > 0) {
            discountAmount = orderTotal;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("code", coupon.getCode());
        response.put("discountAmount", discountAmount);
        response.put("discountType", coupon.getDiscountType());
        response.put("discountValue", coupon.getDiscountValue());
        response.put("message", "✅ Áp dụng mã thành công! Giảm " + discountAmount + "đ");

        return ResponseEntity.ok(response);
    }
}
