package DAJ2EE.repository;

import java.util.List;
import java.util.Optional;

import DAJ2EE.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);

    List<User> findByIsDeletedFalse();
    Optional<User> findByIdAndIsDeletedFalse(Long id);
    Optional<User> findByUsernameAndIsDeletedFalse(String username);
    Optional<User> findByEmailAndIsDeletedFalse(String email);
}
