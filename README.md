# Multiroom Chat

Chat em tempo real com WebSocket usando Socket.IO.

## Descrição

Sistema de chat que permite múltiplos usuários conversarem simultaneamente. O sistema notifica quando usuários entram ou saem e mantém lista de participantes atualizada.

## Tecnologias Utilizadas

- Node.js
- Express
- Socket.IO 2.0.3
- EJS
- Bootstrap 3
- jQuery

## Funcionalidades

- Comunicação em tempo real via WebSocket
- Notificações de entrada e saída de usuários
- Lista de participantes online
- Validação de apelido (3 a 15 caracteres)
- Diferenciação entre reload de página e saída definitiva

## Como Executar

Instalar dependências:
```bash
npm install
```

Iniciar servidor:
```bash
node app.js
```

Acessar no navegador:
```
http://localhost:8080
```

## Estrutura

```
app/
├── controllers/    Lógica de validação e renderização
├── routes/         Definição de rotas HTTP
├── views/          Templates EJS
└── public/         Arquivos estáticos
config/
└── server.js       Configuração Express e middlewares
app.js              Socket.IO e lógica WebSocket
```
