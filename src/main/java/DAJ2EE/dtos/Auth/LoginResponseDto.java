package DAJ2EE.dtos.Auth;


public class LoginResponseDto {
    private String token;
    private ResponseDto user;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public ResponseDto getUser() { return user; }
    public void setUser(ResponseDto user) { this.user = user; }
}
