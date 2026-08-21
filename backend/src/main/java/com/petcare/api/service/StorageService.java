package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png");

    private final S3Client s3Client;

    @Value("${aws.s3.bucket:petcare-photos}")
    private String bucketName;

    public String uploadFile(UUID petId, MultipartFile file) {
        validateFile(file);

        String extension = getExtension(file.getOriginalFilename());
        String key = "pets/" + petId + "/" + UUID.randomUUID() + "." + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));

            return getFileUrl(key);
        } catch (IOException e) {
            log.error("Erro ao fazer upload do arquivo para S3", e);
            throw new BusinessException("Erro ao fazer upload do arquivo");
        }
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;

        String key = extractKeyFromUrl(fileUrl);
        if (key == null) return;

        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteRequest);
        } catch (Exception e) {
            log.warn("Erro ao deletar arquivo do S3: {}", key, e);
        }
    }

    private String getFileUrl(String key) {
        GetUrlRequest urlRequest = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        return s3Client.utilities().getUrl(urlRequest).toString();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException("Arquivo está vazio");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("Arquivo excede o tamanho máximo de 5MB");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BusinessException("Tipo de arquivo inválido. Apenas JPEG e PNG são permitidos");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    private String extractKeyFromUrl(String url) {
        // URL format: http(s)://bucket.s3.region.amazonaws.com/key or http://localhost:4566/bucket/key
        try {
            if (url.contains(bucketName + "/")) {
                return url.substring(url.indexOf(bucketName + "/") + bucketName.length() + 1);
            }
            // path-style: .../bucket/key
            int bucketIdx = url.indexOf("/" + bucketName + "/");
            if (bucketIdx != -1) {
                return url.substring(bucketIdx + bucketName.length() + 2);
            }
        } catch (Exception e) {
            log.warn("Não foi possível extrair key da URL: {}", url);
        }
        return null;
    }
}
