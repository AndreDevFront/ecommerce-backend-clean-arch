# 🛍️ E-commerce API (Clean Architecture)

Uma API RESTful robusta e escalável para E-commerce, construída com princípios de **Clean Architecture**, **DDD (Domain-Driven Design)** e **SOLID**.
Desenvolvida para ser agnóstica ao produto (White Label), servindo desde lojas de velas artesanais até vestuário.

## 🚀 Tecnologias & Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM
- **Autenticação:** JWT (Passport Strategy)
- **Validação:** Zod
- **Storage:** Cloudflare R2 (Compatível com AWS S3)
- **Eventos:** EventEmitter2 (Arquitetura orientada a eventos)
- **Email:** Nodemailer

## 🏛️ Arquitetura

O projeto segue estritamente a separação de camadas:

- **src/domain**: O coração do software. Contém as Entidades e Interfaces dos Repositórios. Zero dependências externas.
- **src/application**: Casos de uso (Use Cases) que orquestram a lógica de negócio.
- **src/infra**: Implementações concretas (Banco de Dados, Controllers HTTP, Gateways de Email, Storage).

## ✨ Funcionalidades

### 🔐 Autenticação

- Criação de Conta e Login (JWT).
- Proteção de rotas via Guards.

### 📦 Catálogo de Produtos

- CRUD completo (Criar, Listar, Editar, Remover).
- Upload de imagens integrado ao Cloudflare R2.
- Atributos dinâmicos (flexibilidade para diferentes nichos).
- Vitrine pública e gestão administrativa.

### 🛒 Gestão de Pedidos

- Criação de pedido com validação de estoque.
- Cálculo automático de totais.
- Fluxo de status: `PENDING` → `PAID` ou `CANCELED`.
- Listagem de pedidos recentes (Admin).

### 📧 Notificações

- Sistema desacoplado de Listeners.
- Disparo automático de e-mail na criação do pedido (para o cliente e para o lojista).

## 🛠️ Como Rodar Localmente

### Pré-requisitos

- Node.js (v18+)
- Docker (Opcional, para rodar o PostgreSQL)

### Passo a Passo

1. **Clone o repositório**

```bash
git clone [https://github.com/andredevfront/nome-do-repo.git](https://github.com/andredevfront/nome-do-repo.git)
cd nome-do-repo
```

2. **Instale as dependências:**

```bash
npm install
```

3. Configure as Variáveis de Ambiente Crie um arquivo .env na raiz do projeto. Copie o modelo abaixo e preencha com seus dados:

# 🐘 Banco de Dados

DATABASE_URL="postgresql://docker:docker@localhost:5432/velas_db"

# 🔐 Autenticação (JWT RS256)

# Gere chaves base64 reais para produção

JWT_PRIVATE_KEY="sua_chave_privada_base64"
JWT_PUBLIC_KEY="sua_chave_publica_base64"

# ☁️ Cloudflare R2 / AWS S3 (Storage)

CLOUDFLARE_ACCOUNT_ID="seu_account_id"
AWS_ACCESS_KEY_ID="sua_access_key"
AWS_SECRET_ACCESS_KEY="sua_secret_key"
AWS_BUCKET_NAME="nome-do-bucket"

# 📧 Email (SMTP - Gmail ou Ethereal)

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu@email.com"
SMTP_PASS="senha_de_app_gerada"

4. **Suba o Banco de Dados (Via Docker) Se não tiver o Postgres instalado localmente, use este comando para subir um container pronto:**

´´´bash

docker run --name pg-ecommerce -e POSTGRES_PASSWORD=docker -e POSTGRES_USER=docker -e POSTGRES_DB=store_db -p 5432:5432 -d postgres
Rode o Servidor
´´´

´´´bash
docker exec -it pg-ecommerce psql -U docker -d store_db
´´´
´´´bash
npm run start:dev
´´´

5. ## 📁 Estrutura do Projeto
   src/
   ├── application/ # Regras de negócio (Use Cases)
   │ └── use-cases/ # Ex: create-order, get-product...
   ├── domain/ # Entidades, Eventos e Contratos
   │ ├── entities/ # Ex: Product, Order, User
   │ ├── events/ # Ex: order-created.event.ts
   │ └── repositories/ # Interfaces (Contratos)
   └── infra/ # Implementações concretas e Framework
   ├── database/ # TypeORM, Mappers
   ├── http/ # Controllers, Presenters, DTOs (Zod)
   ├── env/ # Configuração de ambiente (Zod)
   └── listeners/ # Ouvintes de eventos (Envio de Email)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✍️ Autor

André Luz da Silva - [andreluzdasilva10@gmail.com](mailto:andreluzdasilva10@gmail.com)

---

⌨️ com ❤️ por [AndreDevFront](https://github.com/AndreDevFront)
