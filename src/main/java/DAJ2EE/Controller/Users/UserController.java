package DAJ2EE.controller.Users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import DAJ2EE.dtos.Users.UserUpdateDto;
import DAJ2EE.service.Users.UserService;
import org.springframework.security.core.Authentication;

@Controller
@RequestMapping("users")
@RestController
public class UserController {
    private UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PutMapping("/{id}")
    public UserUpdateDto updateUser(@PathVariable Long id, @RequestBody UserUpdateDto userUpdateDto, Authentication authentication) {
        return userService.updateUser(id, userUpdateDto, authentication);
    }
}
