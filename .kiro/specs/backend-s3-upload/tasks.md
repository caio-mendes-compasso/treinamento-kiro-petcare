# Implementation Plan: Upload de Fotos — Integração S3

## Overview

Implementação do StorageService com validação e upload S3, endpoint multipart no PetController e infraestrutura LocalStack.

## Tasks

- [x] 1. Criar StorageService
  - [x] 1.1 Implementar validateFile: verificar isEmpty, size > 5MB, contentType not in (jpeg, png)
  - [x] 1.2 Implementar uploadFile: gerar key, PutObjectRequest, retornar URL via getUrl
  - [x] 1.3 Implementar deleteFile: extrair key da URL, DeleteObjectRequest, log warning em falha
  - [x] 1.4 Implementar getExtension helper
  - _Requirements: 1.1-1.6_

- [x] 2. Adicionar endpoint no PetController
  - [x] 2.1 POST /{id}/photo com @RequestParam("file") MultipartFile
  - [x] 2.2 Chamar storageService.uploadFile + petService.updatePhotoUrl
  - [x] 2.3 Retornar Map.of("photoUrl", url) com status 200
  - _Requirements: 2.1-2.4_

- [x] 3. Configurar infraestrutura
  - [x] 3.1 Adicionar spring.servlet.multipart config no application.yml (5MB/10MB)
  - [x] 3.2 Adicionar aws.s3.bucket no application-local.yml
  - [x] 3.3 Criar scripts/init-localstack.sh (mb s3://petcare-photos, create-queue)
  - [x] 3.4 Montar script no docker-compose.yml via volume
  - _Requirements: 3.1-3.4_

- [x] 4. Validar compilação com `mvn compile`
