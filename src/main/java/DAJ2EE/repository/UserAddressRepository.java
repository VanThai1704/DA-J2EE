package DAJ2EE.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import DAJ2EE.entity.UserAddress;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
}
