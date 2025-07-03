const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

const trabalhosPath = path.join(__dirname, 'trabalhos.json');

app.use(express.urlencoded({ extended: true }));

// Inicializa o arquivo trabalhos.json se não existir
if (!fs.existsSync(trabalhosPath)) {
    fs.writeFileSync(trabalhosPath, JSON.stringify([]));
}

// Rotas para exibir os formulários
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/inserir', (req, res) => res.sendFile(path.join(__dirname, 'inserirtrabalho.html')));
app.get('/excluir', (req, res) => res.sendFile(path.join(__dirname, 'excluirtrabalho.html')));
app.get('/editar', (req, res) => res.sendFile(path.join(__dirname, 'editartrabalho.html')));

// Rota para listar os trabalhos em formato de tabela HTML
app.get('/listar', (req, res) => {
    const dados = JSON.parse(fs.readFileSync(trabalhosPath));
    let tabela = `
    <html>
    <head>
        <title>Lista de Trabalhos</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-4">
        <h1 class="mb-3">Trabalhos Escolares</h1>
        <form method="GET" action="/listar">
            <div class="mb-3">
                <label for="filtro" class="form-label">Filtrar por disciplina:</label>
                <input type="text" id="filtro" name="filtro" class="form-control" placeholder="Ex: Matemática">
            </div>
            <button class="btn btn-primary">Filtrar</button>
            <a href="/" class="btn btn-secondary ms-2">Voltar</a>
        </form><br>
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr><th>Título</th><th>Descrição</th><th>Disciplina</th></tr>
            </thead>
            <tbody>
    `;

    const filtro = req.query.filtro ? req.query.filtro.toLowerCase() : '';
    dados.forEach(t => {
        if (!filtro || t.disciplina.toLowerCase().includes(filtro)) {
            tabela += `<tr><td>${t.titulo}</td><td>${t.descricao}</td><td>${t.disciplina}</td></tr>`;
        }
    });

    tabela += `</tbody></table></body></html>`;
    res.send(tabela);
});

// Inserir trabalho
app.post('/inserir', (req, res) => {
    const { titulo, descricao, disciplina } = req.body;
    const trabalhos = JSON.parse(fs.readFileSync(trabalhosPath));
    trabalhos.push({ titulo, descricao, disciplina });
    fs.writeFileSync(trabalhosPath, JSON.stringify(trabalhos, null, 2));
    res.send('<script>alert("Trabalho incluído com sucesso!");window.location="/";</script>');
});

// Excluir trabalho (por título)
app.post('/excluir', (req, res) => {
    const { titulo } = req.body;
    let trabalhos = JSON.parse(fs.readFileSync(trabalhosPath));
    const original = trabalhos.length;
    trabalhos = trabalhos.filter(t => t.titulo.toLowerCase() !== titulo.toLowerCase());
    fs.writeFileSync(trabalhosPath, JSON.stringify(trabalhos, null, 2));
    const msg = (trabalhos.length < original) ? "Trabalho excluído com sucesso!" : "Trabalho não encontrado!";
    res.send(`<script>alert("${msg}");window.location="/";</script>`);
});

// Editar trabalho (por título)
app.post('/editar', (req, res) => {
    const { titulo, novaDescricao, novaDisciplina } = req.body;
    const trabalhos = JSON.parse(fs.readFileSync(trabalhosPath));
    const index = trabalhos.findIndex(t => t.titulo.toLowerCase() === titulo.toLowerCase());
    if (index !== -1) {
        if (novaDescricao) trabalhos[index].descricao = novaDescricao;
        if (novaDisciplina) trabalhos[index].disciplina = novaDisciplina;
        fs.writeFileSync(trabalhosPath, JSON.stringify(trabalhos, null, 2));
        res.send('<script>alert("Trabalho atualizado com sucesso!");window.location="/";</script>');
    } else {
        res.send('<script>alert("Trabalho não encontrado!");window.location="/";</script>');
    }
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
