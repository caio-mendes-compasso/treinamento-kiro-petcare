package com.petcare.api.service;

import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.UserResponse;
import com.petcare.api.model.dto.UserUpdateRequest;
import com.petcare.api.model.entity.User;
import com.petcare.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (request.name() != null) {
            user.setName(request.name());
        }
        if (request.cpf() != null) {
            user.setCpf(request.cpf());
        }

        user = userRepository.save(user);
        return UserResponse.from(user);
    }
}
