package DAJ2EE.dtos.Auth;

import lombok.Data;
import DAJ2EE.enums.GenderEnum;

@Data

public class RegisterDto {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private GenderEnum gender;
    private String phone;
}
