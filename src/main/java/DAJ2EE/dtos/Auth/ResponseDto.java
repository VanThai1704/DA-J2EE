package DAJ2EE.dtos.Auth;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ResponseDto {
    private long id;
    private String fullName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
