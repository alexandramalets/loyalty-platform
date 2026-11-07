package com.retail.loyalty.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retail.loyalty.dto.AuthRequest;
import com.retail.loyalty.dto.AuthResponse;
import com.retail.loyalty.dto.UserResponse;
import com.retail.loyalty.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Авторизация")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Войти в систему")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    @Operation(summary = "Текущий сотрудник")
    public UserResponse me(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String header) {
        return authService.current(extract(header));
    }

    @PostMapping("/logout")
    @Operation(summary = "Завершить сессию")
    public void logout(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String header) {
        authService.logout(extract(header));
    }

    private String extract(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            return null;
        }
        return header.substring(7);
    }
}
