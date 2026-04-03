package DAJ2EE.Service;

import DAJ2EE.entity.User;
import DAJ2EE.repository.CartItemRepository;
import DAJ2EE.repository.CartRepository;
import DAJ2EE.repository.UserAddressRepository;
import DAJ2EE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserAddressRepository userAddressRepository;

    public List<User> findAll() {
        return userRepository.findByIsDeletedFalse();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findByIdAndIsDeletedFalse(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsernameAndIsDeletedFalse(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailAndIsDeletedFalse(email);
    }

    public User register(User user) {
        // Validate username/email not exist
        if (userRepository.findByUsernameAndIsDeletedFalse(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmailAndIsDeletedFalse(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setUpdatedAt(LocalDateTime.now());
        user.setIsDeleted(false);

        User savedUser = userRepository.save(user);

        // Auto-create cart for new user
        DAJ2EE.entity.Cart cart = new DAJ2EE.entity.Cart();
        cart.setUser(savedUser);
        cartService.save(cart);

        return savedUser;
    }

    public Optional<User> authenticate(String username, String password) {
        Optional<User> user = userRepository.findByUsernameAndIsDeletedFalse(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    public User update(Long id, User userDetails) {
        User user = findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(userDetails.getEmail());
        user.setFullName(userDetails.getFullName());
        user.setPhone(userDetails.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public void delete(Long id) {
        User user = findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void hardDelete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Delete addresses
        userAddressRepository.deleteAll(userAddressRepository.findByUserId(id));
        // Delete cart items then carts
        cartRepository.findByUserId(id).forEach(cart -> {
            cartItemRepository.deleteAll(cartItemRepository.findByCartId(cart.getId()));
            cartRepository.delete(cart);
        });
        userRepository.delete(user);
    }
}
