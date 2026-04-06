package DAJ2EE.repository;

import java.util.List;
import java.util.Optional;

import DAJ2EE.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByIsDeletedFalse();
    Optional<UserAddress> findByIdAndIsDeletedFalse(Long id);
    List<UserAddress> findByUserIdAndIsDeletedFalse(Long userId);
    List<UserAddress> findByUserId(Long userId);
}
