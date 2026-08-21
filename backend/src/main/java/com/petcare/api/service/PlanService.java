package com.petcare.api.service;

import com.petcare.api.model.dto.PlanResponse;
import com.petcare.api.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanResponse> findAllActive() {
        return planRepository.findByActiveTrue().stream()
                .map(PlanResponse::from)
                .toList();
    }
}
