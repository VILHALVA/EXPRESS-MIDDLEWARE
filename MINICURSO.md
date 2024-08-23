# MINICURSO
## O QUE É O **EXPRESS MIDDLEWARE**?
O **Express Middleware** é uma função no Express.js que tem acesso ao objeto `request` (req), ao objeto `response` (res), e à próxima função no ciclo de solicitação/resposta da aplicação. Essas funções podem executar qualquer código, modificar os objetos `req` e `res`, encerrar o ciclo de solicitação/resposta, ou invocar a próxima função middleware na pilha.

Um middleware pode ser usado para uma variedade de tarefas, como manipulação de requisições, autenticação, registro de atividades (logging), manipulação de erros, e controle de acesso.

## ESTRUTURA BÁSICA DE UM MIDDLEWARE:
Aqui está um exemplo básico de um middleware em Express:

```javascript
const express = require('express');
const app = express();

const meuMiddleware = (req, res, next) => {
    console.log('Middleware em ação!');
    next(); // Passa o controle para o próximo middleware ou rota
};

app.use(meuMiddleware);

app.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

app.listen(2000, () => {
    console.log('Servidor rodando na porta 2000');
});
```

### EXPLICAÇÃO:
- **`app.use(meuMiddleware)`**: Aplica o middleware em todas as rotas da aplicação. O middleware imprime uma mensagem no console e, em seguida, chama `next()` para passar o controle para o próximo middleware ou rota.

## **CONTROLE DE ACESSO** COM MIDDLEWARE:
O **controle de acesso** com middleware pode ser implementado para verificar se um usuário está autenticado ou autorizado a acessar determinadas rotas.

### EXEMPLO: CONTROLE DE ACESSO SIMPLES:
Vamos criar um middleware para proteger uma rota específica, permitindo o acesso apenas a usuários autenticados.

1. **Middleware de Autenticação**:

```javascript
// Middleware de autenticação
const autenticar = (req, res, next) => {
    const { nome, senha } = req.body;

    // Verifica se o usuário é admin
    if (nome === process.env.ADMIN_NAME && senha === process.env.ADMIN_PASSWORD) {
        req.user = { role: 'admin' }; // Adiciona informação sobre o usuário na requisição
        next(); // Usuário autenticado, passa para a próxima função
    } 
    else {
        res.status(401).send('Acesso negado: Usuário não autorizado');
    }
};
```

2. **Aplicando o Middleware em uma Rota**:

```javascript
app.post('/login', autenticar, (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/admin');
    } 
    else {
        res.redirect('/usuario');
    }
});
```

### EXPLICAÇÃO DO CÓDIGO:
- **Middleware `autenticar`**:
  - Verifica se as credenciais enviadas (nome e senha) correspondem às credenciais de administrador definidas nas variáveis de ambiente (`.env`).
  - Se o usuário for autenticado como admin, adiciona um objeto `user` à requisição (`req.user`) e chama `next()` para prosseguir.
  - Se as credenciais não corresponderem, envia uma resposta `401` ("Acesso negado").

- **Protegendo a Rota**:
  - O middleware `autenticar` é aplicado na rota `/login`. Se o middleware autorizar o usuário, ele será redirecionado para a página de admin ou usuário, dependendo do papel (`role`) identificado.

## **EXEMPLO COMPLETO** DE CONTROLE DE ACESSO COM MIDDLEWARE:
```javascript
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticação
const autenticar = (req, res, next) => {
    const { nome, senha } = req.body;

    if (nome === process.env.ADMIN_NAME && senha === process.env.ADMIN_PASSWORD) {
        req.user = { role: 'admin' };
        next();
    } 
    else {
        req.user = { role: 'user' };
        next();
    }
};

// Página de login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

// Login com autenticação
app.post('/login', autenticar, (req, res) => {
    if (req.user.role === 'admin') {
        res.sendFile(__dirname + '/public/ADMIN.html');
    } 
    else {
        res.sendFile(__dirname + '/public/USUARIO.html');
    }
});

// Inicia o servidor
app.listen(2000, () => {
    console.log('Servidor rodando na porta 2000');
});
```

### PASSO A PASSO:
1. **Configuração do Servidor**:
   - O middleware de autenticação (`autenticar`) é criado para verificar as credenciais do usuário. Se forem válidas, o usuário é identificado como admin, caso contrário, como usuário comum.

2. **Rota de Login**:
   - Quando o usuário envia suas credenciais para a rota `/login`, o middleware é executado.
   - Dependendo do papel (`role`) identificado, o usuário é redirecionado para a página adequada (admin ou usuário).

3. **Execução**:
   - Execute o aplicativo e acesse `http://localhost:2000`. Após o login, o middleware de controle de acesso garantirá que somente usuários autorizados acessem as áreas específicas.

## CONCLUSÃO:
O Express Middleware é uma ferramenta poderosa para adicionar lógica de controle de acesso em suas aplicações. Ele permite que você gerencie autenticação, autorizações, e manipule o fluxo de requisições e respostas com eficiência. Por meio de exemplos como este, você pode expandir o uso de middlewares para criar aplicações robustas e seguras.