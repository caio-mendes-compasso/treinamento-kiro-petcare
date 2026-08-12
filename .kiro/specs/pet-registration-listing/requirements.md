# Requirements Document

## Introduction

Funcionalidade de cadastro e listagem de pets na área protegida do PetCare. Permite ao usuário visualizar seus animais cadastrados em cards visuais, adicionar novos pets via formulário expansível inline, remover pets com confirmação, e respeitar o limite máximo de 3 animais por plano. O estado é gerenciado localmente (sem backend) com dados mock iniciais.

## Glossary

- **PetsPage**: Página principal de listagem e cadastro de pets, acessível na rota protegida `/pets`
- **PetCard**: Componente visual que exibe as informações resumidas de um pet (foto, nome, espécie, raça)
- **PetForm**: Seção expansível inline na PetsPage que contém o formulário de cadastro de novo pet
- **PetGrid**: Grid responsivo que organiza os PetCards na página
- **BreedSelector**: Componente de seleção de raça que exibe opções dinâmicas conforme a espécie selecionada
- **RemoveDialog**: Diálogo de confirmação exibido antes de remover um pet da listagem
- **Pet**: Entidade representando um animal cadastrado, contendo id, nome, espécie, raça, data de nascimento, peso, cor e foto
- **BreedsData**: Arquivo compartilhado de dados de raças por espécie, localizado em `/mocks/breeds.ts`

## Requirements

### Requirement 1: Listagem de Pets

**User Story:** Como usuário autenticado, eu quero visualizar meus pets cadastrados em cards visuais, para que eu possa acompanhar os animais vinculados ao meu plano.

#### Acceptance Criteria

1. WHEN a PetsPage é carregada, THE PetGrid SHALL exibir os pets cadastrados como PetCards contendo foto (ou placeholder emoji 🐕 para Cão, 🐈 para Gato), nome, espécie e raça.
2. THE PetGrid SHALL inicializar com 2 pets mock: "Thor" (Cão, Golden Retriever) e "Luna" (Gato, Siamês).
3. WHILE a largura da tela for inferior a 768px, THE PetGrid SHALL exibir os PetCards em 1 coluna.
4. WHILE a largura da tela for entre 768px e 1023px, THE PetGrid SHALL exibir os PetCards em 2 colunas.
5. WHILE a largura da tela for igual ou superior a 1024px, THE PetGrid SHALL exibir os PetCards em 3 colunas.
6. WHEN um Pet não possuir foto, THE PetCard SHALL exibir o emoji 🐕 para espécie "Cão", o emoji 🐈 para espécie "Gato", ou o emoji 🐾 para espécie "Outro" como placeholder.

### Requirement 2: Limite de Pets por Plano

**User Story:** Como usuário, eu quero ser informado quando atingir o limite de animais do meu plano, para que eu saiba que não posso cadastrar mais pets.

#### Acceptance Criteria

1. WHILE a quantidade de pets cadastrados for menor que 3, THE PetsPage SHALL exibir o botão "Adicionar Pet".
2. WHILE a quantidade de pets cadastrados for igual a 3, THE PetsPage SHALL ocultar o botão "Adicionar Pet".
3. WHILE a quantidade de pets cadastrados for igual a 3, THE PetsPage SHALL exibir uma mensagem informativa indicando que o limite máximo de 3 pets por plano foi atingido.

### Requirement 3: Formulário de Cadastro Expansível

**User Story:** Como usuário, eu quero cadastrar um novo pet preenchendo um formulário inline, para que eu possa adicionar animais à minha conta de forma prática.

#### Acceptance Criteria

1. WHEN o usuário clicar no botão "Adicionar Pet", THE PetForm SHALL expandir como seção inline na PetsPage (sem modal).
2. THE PetForm SHALL conter os campos: Nome, Espécie (select), Raça (dinâmico), Data de Nascimento, Peso (kg), Cor/Pelagem e Upload de Foto.
3. WHEN o usuário selecionar a espécie "Cão" no campo Espécie, THE BreedSelector SHALL exibir as raças de cães disponíveis em BreedsData como opções de select.
4. WHEN o usuário selecionar a espécie "Gato" no campo Espécie, THE BreedSelector SHALL exibir as raças de gatos disponíveis em BreedsData como opções de select.
5. WHEN o usuário selecionar a espécie "Outro" no campo Espécie, THE BreedSelector SHALL transformar-se em um campo de texto livre para digitação manual da raça.
6. WHEN o usuário alterar a espécie selecionada, THE BreedSelector SHALL limpar o valor de raça previamente selecionado.

### Requirement 4: Upload de Foto

**User Story:** Como usuário, eu quero fazer upload de uma foto do meu pet, para que eu possa identificá-lo visualmente na listagem.

#### Acceptance Criteria

1. THE PetForm SHALL aceitar upload de arquivos exclusivamente do tipo imagem (image/*).
2. WHEN o usuário selecionar um arquivo de imagem válido, THE PetForm SHALL exibir uma preview da imagem utilizando FileReader API.
3. IF o usuário selecionar um arquivo com tamanho superior a 5MB, THEN THE PetForm SHALL exibir uma mensagem de erro informando que o tamanho máximo permitido é 5MB.
4. IF o usuário selecionar um arquivo que não seja do tipo imagem, THEN THE PetForm SHALL rejeitar o arquivo e exibir mensagem de erro informando que apenas imagens são aceitas.

### Requirement 5: Validação do Formulário

**User Story:** Como usuário, eu quero ser notificado sobre campos inválidos ou obrigatórios não preenchidos, para que eu possa corrigir os dados antes de submeter.

#### Acceptance Criteria

1. THE PetForm SHALL validar todos os campos obrigatórios (Nome, Espécie, Raça, Data de Nascimento, Peso, Cor/Pelagem) utilizando schema Zod.
2. WHEN o usuário submeter o formulário com campos obrigatórios vazios, THE PetForm SHALL exibir mensagens de erro específicas para cada campo inválido.
3. WHEN o campo Peso contiver valor não numérico ou menor/igual a zero, THE PetForm SHALL exibir mensagem de erro indicando que o peso deve ser um número positivo.
4. WHEN o campo Nome contiver menos de 1 caractere ou mais de 50 caracteres, THE PetForm SHALL exibir mensagem de erro indicando o limite de caracteres permitido.

### Requirement 6: Submissão e Adição à Listagem

**User Story:** Como usuário, eu quero que o pet cadastrado apareça imediatamente na listagem, para que eu tenha feedback visual do cadastro realizado.

#### Acceptance Criteria

1. WHEN o usuário submeter o formulário com todos os campos válidos, THE PetsPage SHALL adicionar o novo Pet à listagem local e exibir o PetCard correspondente no PetGrid.
2. WHEN o cadastro for concluído com sucesso, THE PetForm SHALL recolher a seção expansível e limpar todos os campos do formulário.
3. THE PetsPage SHALL gerar um identificador único (id) para cada novo Pet cadastrado.

### Requirement 7: Remoção de Pet

**User Story:** Como usuário, eu quero remover um pet da listagem com confirmação, para que eu não exclua um animal acidentalmente.

#### Acceptance Criteria

1. THE PetCard SHALL exibir um botão "Remover" para cada pet listado.
2. WHEN o usuário clicar no botão "Remover" de um PetCard, THE PetsPage SHALL exibir o RemoveDialog solicitando confirmação da remoção.
3. WHEN o usuário confirmar a remoção no RemoveDialog, THE PetsPage SHALL remover o Pet correspondente da listagem local.
4. WHEN o usuário cancelar a remoção no RemoveDialog, THE PetsPage SHALL fechar o diálogo e manter o Pet na listagem.

### Requirement 8: Migração do Arquivo de Raças

**User Story:** Como desenvolvedor, eu quero que o arquivo de raças seja compartilhado entre funcionalidades, para que eu não precise duplicar dados entre componentes.

#### Acceptance Criteria

1. THE BreedsData SHALL residir no caminho `/mocks/breeds.ts` como arquivo compartilhado do projeto.
2. WHEN o BreedsData for movido, THE PetStep do fluxo de planos SHALL manter funcionamento correto ajustando o import para o novo caminho `/mocks/breeds.ts`.
3. THE BreedsData SHALL incluir a espécie "Outro" com array vazio de raças, indicando que a entrada será via texto livre.
