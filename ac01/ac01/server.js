const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const jogadoresPath = path.join(__dirname, 'jogadores.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para salvar os dados atualizados no arquivo JSON
function salvarDados(jogadores) {
    fs.writeFileSync(jogadoresPath, JSON.stringify(jogadores, null, 2));
}

// Rota principal com links para as funcionalidades
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para exibir o formulário HTML para inserir um novo jogador
app.get('/inserir-jogador', (req, res) => {
    res.sendFile(path.join(__dirname, 'inserirjogador.html'));
});

// Rota para processar a inserção de um novo jogador
app.post('/inserir-jogador', (req, res) => {
    const { nome, descricao, urlFoto, urlVideo } = req.body;

    let jogadoresData = fs.readFileSync(jogadoresPath, 'utf-8');
    let jogadores = JSON.parse(jogadoresData);

    // Verificando se o jogador já existe pelo nome
    if (jogadores.find(jogador => jogador.nome.toLowerCase() === nome.toLowerCase())) {
        res.send('<a href="/">Retorne para a página principal</a><h1>Jogador já existe. Não é possível adicionar duplicatas.</h1>');
        return;
    }

    // Adicionando o novo jogador
    jogadores.push({ nome, descricao, urlFoto, urlVideo });
    salvarDados(jogadores);

    res.send('<a href="/">Retorne para a página principal</a><h1>Jogador do Santos FC adicionado com sucesso!</h1>');
});

// Rota para exibir o formulário HTML para atualizar os dados do jogador
app.get('/atualizar-jogador', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizarjogador.html'));
});

// Rota para processar a requisição POST do formulário e atualizar os dados do jogador
app.post('/atualizar-jogador', (req, res) => {
    const { nome, novaDescricao, novaUrlFoto, novaUrlVideo } = req.body;

    let jogadoresData = fs.readFileSync(jogadoresPath, 'utf-8');
    let jogadores = JSON.parse(jogadoresData);

    const jogadorIndex = jogadores.findIndex(jogador => jogador.nome.toLowerCase() === nome.toLowerCase());

    if (jogadorIndex === -1) {
        res.send('<a href="/">Retorne para a página principal</a><h1>Jogador não encontrado.</h1>');
        return;
    }

    // Atualizando os dados do jogador
    jogadores[jogadorIndex].descricao = novaDescricao || jogadores[jogadorIndex].descricao;
    jogadores[jogadorIndex].urlFoto = novaUrlFoto || jogadores[jogadorIndex].urlFoto;
    jogadores[jogadorIndex].urlVideo = novaUrlVideo || jogadores[jogadorIndex].urlVideo;

    salvarDados(jogadores);

    res.send('<a href="/">Retorne para a página principal</a><h1>Dados do jogador do Santos FC atualizados com sucesso!</h1>');
});

// Rota para exibir o formulário de exclusão de jogador
app.get('/excluir-jogador', (req, res) => {
    res.sendFile(path.join(__dirname, 'excluirjogador.html'));
});

// Rota para processar a exclusão de um jogador
app.post('/excluir-jogador', (req, res) => {
    const { nome } = req.body;

    let jogadoresData = fs.readFileSync(jogadoresPath, 'utf-8');
    let jogadores = JSON.parse(jogadoresData);

    const jogadorIndex = jogadores.findIndex(jogador => jogador.nome.toLowerCase() === nome.toLowerCase());

    if (jogadorIndex === -1) {
        res.send('<a href="/">Retorne para a página principal</a><h1>Jogador não encontrado.</h1>');
        return;
    }

    res.send(`
        <script>
            if (confirm('Tem certeza que deseja excluir o jogador ${nome} do Santos FC?')) {
                window.location.href = '/excluir-jogador-confirmado?nome=${nome}';
            } else {
                window.location.href = '/excluir-jogador';
            }
        </script>
    `);
});

// Rota para confirmar a exclusão de um jogador
app.get('/excluir-jogador-confirmado', (req, res) => {
    const nome = req.query.nome;

    let jogadoresData = fs.readFileSync(jogadoresPath, 'utf-8');
    let jogadores = JSON.parse(jogadoresData);

    const jogadorIndex = jogadores.findIndex(jogador => jogador.nome.toLowerCase() === nome.toLowerCase());

    if (jogadorIndex === -1) {
        res.send('<a href="/">Retorne para a página principal</a><h1>Jogador não encontrado.</h1>');
        return;
    }

    jogadores.splice(jogadorIndex, 1);
    salvarDados(jogadores);

    res.send(`<a href="/">Retorne para a página principal</a><h1>O jogador ${nome} do Santos FC foi excluído com sucesso!</h1>`);
});

// Rota para listar todos os jogadores
app.get('/listar-jogadores', (req, res) => {
    res.sendFile(path.join(__dirname, 'jogadores.json'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log('Servidor iniciado em http://localhost:' + port);
});