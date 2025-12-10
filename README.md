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

## 📁 Estrutura do Projeto

```
src/
├── application/       # Regras de negócio (Use Cases)
│   └── use-cases/     # Ex: create-order, get-product...
├── domain/            # Entidades, Eventos e Contratos
│   ├── entities/      # Ex: Product, Order, User
│   ├── events/        # Ex: order-created.event.ts
│   └── repositories/  # Interfaces (Contratos)
└── infra/             # Implementações concretas e Framework
    ├── database/      # TypeORM, Mappers
    ├── http/          # Controllers, Presenters, DTOs (Zod)
    ├── env/           # Configuração de ambiente (Zod)
    └── listeners/     # Ouvintes de eventos (Envio de Email)
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✍️ Autor

André Luz da Silva - [andreluzdasilva10@gmail.com](mailto:andreluzdasilva10@gmail.com)

---

⌨️ com ❤️ por [AndreDevFront](https://github.com/AndreDevFront)
