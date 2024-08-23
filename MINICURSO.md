# MINICURSO
## O QUE É O **EXPRESS MIDDLEWARE**?
O **Express Middleware** é uma função no Express.js que tem acesso ao objeto `request` (req), ao objeto `response` (res), e à próxima função no ciclo de solicitação/resposta da aplicação. Essas funções podem executar qualquer código, modificar os objetos `req` e `res`, encerrar o ciclo de solicitação/resposta, ou invocar a próxima função middleware na pilha.

Um middleware pode ser usado para uma variedade de tarefas, como manipulação de requisições, autenticação, registro de atividades (logging), manipulação de erros, e controle de acesso.

## EXEMPLO BÁSICO:
### ESTRUTURA BÁSICA DE UM MIDDLEWARE:
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

#### EXPLICAÇÃO:
- **`app.use(meuMiddleware)`**: Aplica o middleware em todas as rotas da aplicação. O middleware imprime uma mensagem no console e, em seguida, chama `next()` para passar o controle para o próximo middleware ou rota.

### **CONTROLE DE ACESSO** COM MIDDLEWARE:
O **controle de acesso** com middleware pode ser implementado para verificar se um usuário está autenticado ou autorizado a acessar determinadas rotas.

#### EXEMPLO: CONTROLE DE ACESSO SIMPLES:
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

#### EXPLICAÇÃO DO CÓDIGO:
- **Middleware `autenticar`**:
  - Verifica se as credenciais enviadas (nome e senha) correspondem às credenciais de administrador definidas nas variáveis de ambiente (`.env`).
  - Se o usuário for autenticado como admin, adiciona um objeto `user` à requisição (`req.user`) e chama `next()` para prosseguir.
  - Se as credenciais não corresponderem, envia uma resposta `401` ("Acesso negado").

- **Protegendo a Rota**:
  - O middleware `autenticar` é aplicado na rota `/login`. Se o middleware autorizar o usuário, ele será redirecionado para a página de admin ou usuário, dependendo do papel (`role`) identificado.

### **EXEMPLO COMPLETO** DE CONTROLE DE ACESSO COM MIDDLEWARE:
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

#### PASSO A PASSO:
1. **Configuração do Servidor**:
   - O middleware de autenticação (`autenticar`) é criado para verificar as credenciais do usuário. Se forem válidas, o usuário é identificado como admin, caso contrário, como usuário comum.

2. **Rota de Login**:
   - Quando o usuário envia suas credenciais para a rota `/login`, o middleware é executado.
   - Dependendo do papel (`role`) identificado, o usuário é redirecionado para a página adequada (admin ou usuário).

3. **Execução**:
   - Execute o aplicativo e acesse `http://localhost:2000`. Após o login, o middleware de controle de acesso garantirá que somente usuários autorizados acessem as áreas específicas.

### CONCLUSÃO:
O Express Middleware é uma ferramenta poderosa para adicionar lógica de controle de acesso em suas aplicações. Ele permite que você gerencie autenticação, autorizações, e manipule o fluxo de requisições e respostas com eficiência. Por meio de exemplos como este, você pode expandir o uso de middlewares para criar aplicações robustas e seguras.

## EXEMPLO MAIS AVANÇADO:
### MIDDLEWARE EM APLICAÇÕES WEB: LARAVEL VS. EXPRESS:
Em frameworks como Laravel, o middleware é uma ferramenta muito poderosa para manipular requisições HTTP. Um exemplo típico no Laravel que você trouxe seria algo assim:

```php
Route::get('/admin/dashboard', [DashboardController::class, 'index'])
    ->name('admin.dashboard')
    ->middleware(['auth', 'checkemail']);
```

Esse código em Laravel faz o seguinte:

1. **Autenticação (`auth`)**: Verifica se o usuário está autenticado antes de acessar o painel de administração (`/admin/dashboard`).
2. **Verificação Adicional (`checkemail`)**: Realiza uma verificação adicional, como garantir que o e-mail do usuário esteja verificado.
3. **Controlador**: Se todas as verificações passarem, a requisição é passada ao `DashboardController`, onde o método `index` será executado.

### ADAPTANDO PARA EXPRESS.JS:
O conceito de middleware em Express.js é bastante similar, mas a sintaxe e a forma de aplicação diferem. Vamos criar uma implementação equivalente em Express para ilustrar como seria feito.

#### 1. CRIANDO MIDDLEWARES PERSONALIZADOS:
Primeiro, vamos criar dois middlewares: um para autenticação e outro para a verificação adicional (similar ao `checkemail` no Laravel).

```javascript
// middleware/auth.js
const authMiddleware = (req, res, next) => {
    // Verifica se o usuário está autenticado
    if (req.isAuthenticated()) { // Simulação de método de autenticação
        return next();
    }
    res.status(401).send('Acesso negado: Faça login primeiro');
};

// middleware/checkEmail.js
const checkEmailMiddleware = (req, res, next) => {
    // Verifica se o email foi confirmado
    if (req.user && req.user.emailVerified) { // Simulação de verificação de email
        return next();
    }
    res.status(403).send('Acesso negado: Verifique seu e-mail primeiro');
};
```

#### 2. APLICANDO MIDDLEWARE A UMA ROTA:
Agora, aplicamos esses middlewares em uma rota específica, como no exemplo Laravel.

```javascript
const express = require('express');
const app = express();
const authMiddleware = require('./middleware/auth');
const checkEmailMiddleware = require('./middleware/checkEmail');

// Rota protegida com dois middlewares
app.get('/admin/dashboard', authMiddleware, checkEmailMiddleware, (req, res) => {
    res.send('Bem-vindo ao painel de administração!');
});

app.listen(2000, () => {
    console.log('Servidor rodando na porta 2000');
});
```

#### 3. EXPLICAÇÃO DO FLUXO:
- **`authMiddleware`**: Verifica se o usuário está autenticado. Se sim, chama `next()` para passar o controle ao próximo middleware (`checkEmailMiddleware`). Caso contrário, responde com um erro `401` (não autorizado).
  
- **`checkEmailMiddleware`**: Se o usuário passou na autenticação, este middleware verifica se o e-mail do usuário foi verificado. Se sim, a requisição continua para o controlador ou função de rota final; caso contrário, responde com um erro `403` (proibido).

- **Controlador ou Rota**: Se ambas as verificações forem bem-sucedidas, a rota `/admin/dashboard` é acessada e o conteúdo da dashboard é mostrado.

### MAIS COMPLEXO: ENCADEAMENTO E ORGANIZAÇÃO DE MIDDLEWARES:
Esse exemplo demonstra que middlewares podem ser encadeados e organizados de forma modular em Express.js, assim como em Laravel. No entanto, em Express você tem ainda mais flexibilidade:

- **Organização Modular**: Middlewares podem ser organizados em módulos, facilitando a reutilização em diferentes rotas ou aplicações.
- **Middleware por Aplicação ou Rota**: Pode aplicar middleware a um grupo de rotas usando `app.use()` para toda a aplicação ou a grupos de rotas específicas.
- **Encadeamento de Middlewares**: Pode criar uma cadeia complexa de middlewares, onde cada um executa uma parte do processo de validação, manipulação de dados, ou controle de fluxo.

#### EXEMPLO DE ENCADEAMENTO E MODULARIDADE:
Imagine um cenário onde você precisa autenticar, verificar permissões, e depois registrar logs de acesso:

```javascript
const express = require('express');
const app = express();
const authMiddleware = require('./middleware/auth');
const checkEmailMiddleware = require('./middleware/checkEmail');
const logMiddleware = require('./middleware/log');

app.use(logMiddleware); // Log em todas as rotas

app.get('/admin/dashboard', authMiddleware, checkEmailMiddleware, (req, res) => {
    res.send('Bem-vindo ao painel de administração!');
});

app.listen(2000, () => {
    console.log('Servidor rodando na porta 2000');
});
```

### CONCLUSÃO:
O uso de middleware no Express permite que você adicione funcionalidades de forma modular e reutilizável, controlando o fluxo de requisições de maneira poderosa. Isso se alinha com o conceito de middleware em outros frameworks como Laravel, mas com uma sintaxe mais flexível e direta. Essa abordagem modular e encadeada pode ser usada para construir aplicações robustas e seguras, controlando o acesso de usuários de forma precisa e escalável.