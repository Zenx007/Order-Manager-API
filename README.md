# Order Manager API 📦

Uma API robusta para gerenciamento de usuários e pedidos, desenvolvida com **NestJS**, **TypeScript** e **TypeORM**. Este projeto foi construído seguindo princípios de **Clean Architecture** e **SOLID**, focando em manutenibilidade, escalabilidade e segurança.

---

## 🚀 Funcionalidades Principais

- **Gestão de Usuários**: Cadastro, autenticação (JWT), atualização de perfil e alteração de senha.
- **Controle de Acesso (RBAC)**: Diferenciação entre usuários comuns (`USER`) e administradores (`ADMIN`).
- **Gerenciamento de Pedidos**: Criação, listagem, atualização e remoção de pedidos com itens.
- **Transações Atômicas**: Garantia de integridade dos dados ao salvar pedidos e seus respectivos itens através de `Database Transactions`.
- **Paginação e Filtros**: Listagem avançada de dados para performance e usabilidade.
- **Documentação Automática**: Swagger UI configurado para facilitar o consumo da API.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: PostgreSQL (via [TypeORM](https://typeorm.io/))
- **Segurança**: [Passport.js](https://www.passportjs.org/) + [JWT](https://jwt.io/) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Mapeamento**: [AutoMapper](https://automapper.org/)
- **Validação**: [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer)
- **Documentação**: [Swagger/OpenAPI](https://swagger.io/)

---

## 📐 Arquitetura e Padrões de Design

O projeto está organizado em camadas para separar responsabilidades:

1.  **API (Controllers)**: Ponto de entrada, lida com requisições HTTP e documentação Swagger.
2.  **Core (Entidades, Interfaces, Enums)**: O coração do negócio, independente de frameworks.
3.  **Infrastructure (Serviços, Repositórios)**: Implementação concreta de acesso a dados e lógica de serviços.
4.  **Communication (VOs/DTOs)**: Objetos de transferência de dados entre as camadas.

### Padrões Aplicados:
- **Result Pattern**: Encapsulamento de sucessos e falhas em um objeto padrão, evitando o uso de exceções para fluxos esperados de negócio.
- **Repository Pattern**: Abstração da lógica de persistência de dados.
- **Dependency Injection**: Uso do contêiner de DI do NestJS com classes abstratas para maior testabilidade.
- **Nomenclatura Padrão**: Toda a API utiliza o padrão **camelCase** tanto nos endpoints quanto nos métodos internos, seguindo as melhores práticas da comunidade Node.js.

---

## 🔧 Instalação e Execução

Você pode rodar a aplicação de duas formas: utilizando **Docker** (recomendado para facilitar a configuração do banco de dados) ou **localmente**.

### 🐳 Rodando com Docker (Recomendado)

**Nota:** Para esta abordagem, é necessário ter o **Docker** e o **Docker Compose** instalados em sua máquina.

A aplicação já possui suporte a Docker através do `docker-compose`. Este comando subirá tanto o banco de dados PostgreSQL quanto a API.

1.  **Execute o comando:**
    ```bash
    docker-compose up -d --build
    ```
2.  A API estará disponível em `http://localhost:3000`.

### 💻 Rodando Localmente

#### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) rodando localmente.

#### Passo a passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Zenx007/Order-Manager-API.git
    cd ordermanager-api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente (Opcional):**
    A aplicação possui **valores padrão configurados no código**, portanto o arquivo `.env` é opcional caso você utilize as configurações padrão (localhost, porta 5432, user/pass: admin). Caso precise customizar, crie um arquivo `.env` baseado no `.env.example`.

4.  **Execute a aplicação:**
    ```bash
    # Modo desenvolvimento
    npm run start:dev

    # Modo produção
    npm run build
    node dist/main
    ```

---

## 📖 Documentação da API (Swagger)

Com a aplicação rodando, acesse a documentação completa e teste os endpoints em:
👉 **[http://localhost:3000/swagger](http://localhost:3000/swagger)**

---

## 🛣️ Endpoints da API

### 👤 Usuários (`/user`)

| Método | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| **POST** | `/user/save` | Público | Cadastro de novo usuário. |
| **POST** | `/user/login` | Público | Autenticação e geração de token JWT. |
| **GET** | `/user/userInfo` | Logado | Retorna os dados do perfil do usuário logado. |
| **PUT** | `/user/updateSelf` | Logado | Atualiza os dados do próprio usuário. |
| **DELETE** | `/user/deleteSelf` | Logado | Remove a conta do usuário logado. |
| **PUT** | `/user/changePassword` | Logado | Altera a senha do usuário logado. |
| **GET** | `/user/getAll` | Admin | Lista todos os usuários cadastrados. |
| **GET** | `/user/paged` | Admin | Listagem paginada e ordenada de usuários. |
| **PUT** | `/user/update/:id` | Admin | Atualiza os dados de qualquer usuário via ID. |
| **DELETE** | `/user/delete/:id` | Admin | Remove qualquer usuário do sistema via ID. |
| **POST** | `/user/promote/:id` | Admin | Promove um usuário comum a Administrador. |
| **POST** | `/user/demote/:id` | Admin | Remove privilégios administrativos de um usuário. |

### 📦 Pedidos (`/order`)

A visualização de pedidos segue regras de negócio baseadas em perfis:
- **Usuário Comum (`USER`):** Visualiza apenas seus próprios pedidos (Retorno: `OrderVO`).
- **Administrador (`ADMIN`):** Visualiza todos os pedidos do sistema e recebe informações adicionais como o nome e e-mail do proprietário (Retorno: `OrderReturnAdmVO`).

| Método | Endpoint | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| **POST** | `/order` | Logado | Cria um novo pedido com itens. |
| **GET** | `/order/list` | Logado/Admin | Lista pedidos (Respeitando regras de visibilidade). |
| **GET** | `/order/paged` | Logado/Admin | Listagem paginada com filtros (data, valor, etc). |
| **GET** | `/order/:orderId` | Logado/Admin | Busca detalhes de um pedido específico pelo número. |
| **PUT** | `/order/:orderId` | Logado/Admin | Atualiza um pedido existente. |
| **DELETE** | `/order/:orderId` | Logado/Admin | Remove um pedido e seus itens associados. |

#### ✅ Validações de Negócio:
- **Unicidade de Pedido:** Não é permitido criar um pedido com um `orderId` (numeroPedido) já existente.
- **Unicidade de Item:** Um pedido não pode conter o mesmo `productId` mais de uma vez (tanto na criação quanto na atualização).
- **Imutabilidade de ID:** O `orderId` (numeroPedido) de um pedido não pode ser alterado após a criação.