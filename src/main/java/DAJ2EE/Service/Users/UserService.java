package DAJ2EE.service.Users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import DAJ2EE.dtos.Users.UserUpdateDto;
import DAJ2EE.entity.User;
import DAJ2EE.repository.UserRepository;
import org.springframework.security.core.Authentication;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public UserUpdateDto updateUser(Long id, UserUpdateDto userUpdateDto, Authentication authentication) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getUsername().equals(authentication.getName())) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin) {
                throw new RuntimeException("Bạn không có quyền cập nhật thông tin người dùng này");
            }
        }
        if (userUpdateDto.getFullName() != null) {
            user.setFullName(userUpdateDto.getFullName());
        }
        if (userUpdateDto.getPhone() != null) {
            user.setPhone(userUpdateDto.getPhone());
        }
        if (userUpdateDto.getGender() != null) {
            user.setGender(userUpdateDto.getGender());
        }
        if (userUpdateDto.getUpdatedAt() != null) {
            user.setUpdatedAt(userUpdateDto.getUpdatedAt());
        }
        userRepository.save(user);
        // Gán lại dữ liệu đã lưu lên DTO để trả về JSON không bị dính null
        userUpdateDto.setFullName(user.getFullName());
        userUpdateDto.setPhone(user.getPhone());
        userUpdateDto.setGender(user.getGender());
        userUpdateDto.setUpdatedAt(user.getUpdatedAt());
        return userUpdateDto;
    }
}
