package com.retail.loyalty.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.StaffUser;
import com.retail.loyalty.dto.AuthRequest;
import com.retail.loyalty.dto.AuthResponse;
import com.retail.loyalty.dto.UserResponse;
import com.retail.loyalty.exception.UnauthorizedException;
import com.retail.loyalty.repository.StaffUserRepository;
import com.retail.loyalty.security.AuthTokenService;

@Service
@Transactional
public class AuthService {

    private static final DateTimeFormatter LOGIN_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy 'в' HH:mm");
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    private final StaffUserRepository users;
    private final AuthTokenService tokens;
    private final PasswordEncoder encoder;

    public AuthService(StaffUserRepository users, AuthTokenService tokens, PasswordEncoder encoder) {
        this.users = users;
        this.tokens = tokens;
        this.encoder = encoder;
    }

    public AuthResponse login(AuthRequest request) {
        StaffUser user = users.findByEmailIgnoreCase(request.email().trim())
                .filter(item -> encoder.matches(request.password(), item.getPasswordHash()))
                .orElseThrow(() -> new UnauthorizedException("Неверная эл. почта или пароль"));
        user.setLastLogin(LocalDateTime.now());
        return new AuthResponse(tokens.issue(user.getId()), toResponse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse current(String token) {
        Long userId = tokens.resolve(token)
                .orElseThrow(() -> new UnauthorizedException("Требуется авторизация"));
        StaffUser user = users.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Сессия недействительна"));
        return toResponse(user);
    }

    public void logout(String token) {
        tokens.revoke(token);
    }

    public UserResponse toResponse(StaffUser user) {
        return new UserResponse(
                user.getName(),
                user.getInitials(),
                user.getRole(),
                user.getEmail(),
                user.getPhone(),
                user.getLastLogin() == null ? "—" : user.getLastLogin().format(LOGIN_FORMAT),
                user.getPasswordChanged() == null ? "—" : user.getPasswordChanged().format(DATE_FORMAT)
        );
    }
}
