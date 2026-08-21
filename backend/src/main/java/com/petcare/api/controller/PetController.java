package com.petcare.api.controller;

import com.petcare.api.model.dto.PageResponse;
import com.petcare.api.model.dto.PetRequest;
import com.petcare.api.model.dto.PetResponse;
import com.petcare.api.security.CurrentUser;
import com.petcare.api.service.PetService;
import com.petcare.api.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
@Tag(name = "Pets", description = "Gerenciamento de pets")
public class PetController {

    private final PetService petService;
    private final StorageService storageService;

    @GetMapping
    @Operation(summary = "Listar pets do usuário")
    @ApiResponse(responseCode = "200", description = "Lista paginada de pets")
    public ResponseEntity<PageResponse<PetResponse>> list(@CurrentUser UUID userId, Pageable pageable) {
        return ResponseEntity.ok(petService.findByUser(userId, pageable));
    }

    @PostMapping
    @Operation(summary = "Cadastrar novo pet")
    @ApiResponse(responseCode = "201", description = "Pet criado com sucesso")
    @ApiResponse(responseCode = "422", description = "Limite de pets atingido")
    public ResponseEntity<PetResponse> create(@CurrentUser UUID userId, @Valid @RequestBody PetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(petService.create(userId, request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar pet")
    @ApiResponse(responseCode = "200", description = "Pet atualizado")
    @ApiResponse(responseCode = "403", description = "Pet não pertence ao usuário")
    public ResponseEntity<PetResponse> update(@CurrentUser UUID userId, @PathVariable UUID id, @Valid @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.update(userId, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover pet")
    @ApiResponse(responseCode = "204", description = "Pet removido")
    @ApiResponse(responseCode = "403", description = "Pet não pertence ao usuário")
    public ResponseEntity<Void> delete(@CurrentUser UUID userId, @PathVariable UUID id) {
        petService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload de foto do pet")
    @ApiResponse(responseCode = "200", description = "Foto enviada com sucesso")
    @ApiResponse(responseCode = "400", description = "Arquivo inválido (tipo ou tamanho)")
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @CurrentUser UUID userId,
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        String photoUrl = storageService.uploadFile(id, file);
        petService.updatePhotoUrl(userId, id, photoUrl);
        return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
    }
}
