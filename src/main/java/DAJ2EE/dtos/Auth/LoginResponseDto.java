package DAJ2EE.dtos.Auth;

import lombok.Data;

@Data
public class LoginResponseDto {
    private String token;
    private ResponseDto user;
}
