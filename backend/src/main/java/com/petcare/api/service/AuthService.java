package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.*;
import com.petcare.api.model.entity.User;
import com.petcare.api.repository.UserRepository;
import com.petcare.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .build();

        user = userRepository.save(user);

        String accessToken = jwtService.generateToken(user.getId(), user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken, UserResponse.from(user));
    }

    public AuthResponse login(AuthRequest request) {
        // In local profile, accept any valid email with password "123456"
        // In production, this would validate against Cognito
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Email ou senha inválidos"));

        // Local mock: accept password "123456"
        if (!"123456".equals(request.password())) {
            throw new BusinessException("Email ou senha inválidos");
        }

        String accessToken = jwtService.generateToken(user.getId(), user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken, UserResponse.from(user));
    }

    public AuthResponse refresh(RefreshRequest request) {
        if (!jwtService.isTokenValid(request.refreshToken())) {
            throw new BusinessException("Refresh token inválido ou expirado");
        }

        var userId = jwtService.extractUserId(request.refreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        String accessToken = jwtService.generateToken(user.getId(), user.getEmail());
        String newRefreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, newRefreshToken, UserResponse.from(user));
    }
}
