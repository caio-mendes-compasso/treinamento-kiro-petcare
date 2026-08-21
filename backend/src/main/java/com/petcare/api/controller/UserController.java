package com.petcare.api.controller;

import com.petcare.api.model.dto.UserResponse;
import com.petcare.api.model.dto.UserUpdateRequest;
import com.petcare.api.security.CurrentUser;
import com.petcare.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Perfil do usuário")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Obter perfil do usuário autenticado")
    @ApiResponse(responseCode = "200", description = "Dados do perfil")
    public ResponseEntity<UserResponse> getProfile(@CurrentUser UUID userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/me")
    @Operation(summary = "Atualizar perfil do usuário autenticado")
    @ApiResponse(responseCode = "200", description = "Perfil atualizado")
    public ResponseEntity<UserResponse> updateProfile(@CurrentUser UUID userId, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
}
