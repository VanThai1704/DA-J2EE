# Giải thích cấu hình Spring Security (SecurityConfig.java)

Tệp `SecurityConfig.java` là trái tim của hệ thống bảo mật trong ứng dụng Spring Boot. Nó định nghĩa cách thức hệ thống xác thực người dùng (Authentication) và phân quyền (Authorization) truy cập vào các API. 

Dưới đây là phần giải thích chi tiết cho từng thành phần:

## 1. Các Annotation khai báo (Dòng 15-17)
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
```
- `@Configuration`: Đánh dấu class này là một lớp cấu hình. Spring sẽ quét và khởi tạo các `@Bean` bên trong nó lúc chương trình chạy.
- `@EnableWebSecurity`: Kích hoạt và tích hợp Spring Security mặc định vào dự án web.
- `@EnableMethodSecurity`: Bật tính năng kiểm tra quyền hạn (Role/Permission) ngay trên các hàm Controller (Bằng cách sử dụng các thẻ như `@PreAuthorize("hasRole('ADMIN')")`).

## 2. Tiêm các dependency (Dòng 20-24)
```java
private final JwtAuthenticationFilter jwtAuthenticationFilter;

public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
}
```
Lớp này khai báo `JwtAuthenticationFilter` mà chúng ta viết và đưa nó vào thông qua constructor (Constructor Injection). Mục đích để ở bên dưới có thể đưa bộ lọc này vào chuỗi kiểm tra bảo mật.

## 3. Cấu hình giải thuật băm mật khẩu (Dòng 26-29)
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```
- Khởi tạo và cung cấp một đối tượng `PasswordEncoder` dùng chung cho toàn bộ dự án.
- Thuật toán `BCrypt` là chuẩn công nghiệp với cơ chế tự động sinh muối (salt) giúp mã hóa mật khẩu cực kỳ an toàn. Do đã khai báo hàm này thành `@Bean`, bạn có thể `@Autowired PasswordEncoder` ở lớp `AuthService` mà không cần chạy dòng `new BCryptPasswordEncoder()` thủ công nữa.

## 4. Chuỗi màng lọc bảo mật (Security Filter Chain - Dòng 31-43)
Đây là cấu hình quan trọng nhất, nơi quyết định số phận của mọi HTTP Request gửi tới server:
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // 1. Tắt CSRF (Cross-Site Request Forgery)
        .csrf(csrf -> csrf.disable())
        
        // 2. Chuyển đổi quản lý Session thành Stateless
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        
        // 3. Phân quyền Request đường dẫn
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        
        // 4. Nhúng bộ lọc JWT 
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

*Cụ thể từng tác vụ:*

1. **`csrf.disable()`**: Tắt chế độ ngăn chặn CSRF (Giả mạo yêu cầu chéo trang). Bạn dùng API và di truyền bằng mã JWT (không phải Cookies) nên rủi ro tấn công CSRF gần như bằng không, do đó việc thiết lập này là bắt buộc (Bật lên sẽ khiến các lệnh POST/PUT bị chặn).
2. **`sessionCreationPolicy(STATELESS)`**: Khẳnh định rằng Web API này là **Phi trạng thái** (Không lưu Server Session). Mỗi lệnh request gửi đi đều là độc lập, server không "nhớ" request trước đó. Để chứng thực, người dùng BẮT BUỘC phải cung cấp Token ở mọi Request.
3. **`authorizeHttpRequests(...)`**: 
   - `requestMatchers("/api/auth/**", "/auth/**").permitAll()`: Đồng ý cho mở tung cửa các API liên quan đến `auth` (Login, Register). Bất cứ ai cũng được truy cập.
   - `anyRequest().authenticated()`: Đóng cửa mọi API còn lại. Chỉ có những ai có thân phận hợp lệ (đã vác Token qua cửa) mới được đi tiếp.
4. **`addFilterBefore(...)`**: 
   - Để kiểm tra Token xác thực, chúng ta nhúng `jwtAuthenticationFilter` chạy ngay trước `UsernamePasswordAuthenticationFilter` của hệ thống.
   - Khi một Request bay tới, nó sẽ chạy vào Filter của mình trước. Nếu Filter của mình soi được một Token và giải mã ra người đó là User x hợp lệ, Spring sẽ "tha" qua chốt kiểm soát số 3!
