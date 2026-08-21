# Requirements Document

## Introduction

O Pet Care permite que usuários façam upload de fotos dos seus pets. As fotos são armazenadas no AWS S3 (LocalStack em dev) com validação de tipo e tamanho, e a URL é salva na entidade Pet.

## Glossary

- **StorageService**: Service responsável por upload/delete de arquivos no S3
- **LocalStack**: Emulador local da AWS usado em desenvolvimento
- **Presigned URL**: URL temporária com acesso direto ao arquivo no S3
- **Multipart**: Formato HTTP para envio de arquivos (multipart/form-data)

## Requirements

### Requirement 1: StorageService

**User Story:** Como usuário, eu quero fazer upload da foto do meu pet, para que ela apareça no cadastro e na carteirinha.

#### Acceptance Criteria

1. StorageService.uploadFile SHALL validar que o arquivo não está vazio — se sim, lançar BusinessException
2. StorageService.uploadFile SHALL validar que o tamanho é <= 5MB — se não, lançar BusinessException
3. StorageService.uploadFile SHALL validar que o content-type é image/jpeg ou image/png — se não, lançar BusinessException
4. StorageService.uploadFile SHALL gerar path no formato `pets/{petId}/{uuid}.{ext}` para evitar colisões
5. StorageService.uploadFile SHALL fazer upload para o bucket configurado e retornar a URL pública do arquivo
6. StorageService.deleteFile SHALL remover o arquivo do S3 sem lançar exceção se falhar (log warning)

### Requirement 2: Endpoint de Upload

**User Story:** Como frontend, eu quero um endpoint multipart para enviar a foto do pet.

#### Acceptance Criteria

1. POST /api/pets/{id}/photo SHALL aceitar multipart/form-data com parâmetro "file"
2. O endpoint SHALL verificar ownership do pet antes do upload
3. Após upload bem-sucedido, SHALL atualizar pet.photoUrl com a URL retornada pelo StorageService
4. SHALL retornar JSON `{"photoUrl": "..."}` com status 200

### Requirement 3: Infraestrutura LocalStack

**User Story:** Como desenvolvedor, eu quero S3 simulado localmente, para testar uploads sem conta AWS.

#### Acceptance Criteria

1. docker-compose.yml SHALL montar script init-localstack.sh no diretório de inicialização do LocalStack
2. init-localstack.sh SHALL criar o bucket `petcare-photos` via awslocal
3. application.yml SHALL configurar max-file-size 5MB e max-request-size 10MB no spring.servlet.multipart
4. application-local.yml SHALL configurar aws.s3.bucket como petcare-photos
