const fs = require('fs');
const path = require('path');
const express = require('express');
 
const app = express();
const port = 3000;
 
const experimentoPath = path.join(__dirname, 'experimento.json');
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Rota para exibir os 2 links
app.get('/', (req, res) => {
    res.send('<h1>Bem vindo a AC2</h1> <br>' + '<a href="/adicionarexperimento">Adicionar Experimento</a><br>' + '<a href="/experimento">Visualizar Experimentos</a><br>' + '<a href="/buscar-nome/:nome">Filtrar Experimentos</a>');
});
 
function buscarNome(nome) {
    return experimento.find(experimento =>
        experimento.nome.toLowerCase() === nome.toLowerCase());
}
 
// Rota de filtro por nome da matéria
app.get('/buscar-nome/:nome', (req, res) => {
    const nomeDaNomeBuscada = req.params.nome;
    const nomesEncontradas = buscarNome(nomeDaNomeBuscada);
 
    if (nomesEncontradas) {
        res.send('<h1>Informações da nome encontrada:<h1><pre>' +
        JSON.stringify(nomesEncontradas, null, 2) + '</pre>');
    } else {
        res.send(`<h1>Nenhuma informação encontrada.</h1>`);
    }
});
 
// Lendo os dados do arquivo JSON
let experimentoData = fs.readFileSync(experimentoPath, 'utf-8');
let experimento = JSON.parse(experimentoData);
 
// Função para salvar os dados atualizados no arquivo 350N
function salvarDados() {
    fs.writeFileSync(experimentoPath, JSON.stringify(experimento, null, 2));
}
 
// Rota para exibir o formulário HTML
app.get('/adicionarexperimento', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionarexperimento.html'));
});
 
// Rota para processar a requisição POST do formulário
app.post('/adicionarexperimento', (req, res) => {
    const novoexperimento = req.body;
 
    // Verificando se o experimento já existe pelo nome
    if (experimento.find(experimento => experimento.nome.toLowerCase() === novoexperimento.nome.toLowerCase())) {
        res.send('<h1>experimento já existe. Não é possível adicionar duplicatas.</h1>');
        return;
    }
 
    // Adicionando o novo experimento ao array de experimento
    experimento.push(novoexperimento);
 
    // Salvando os dados atualizados no arquivo JSON
    salvarDados();
    // Enviando uma resposta indicando que o experimento foi adicionado com sucesso
    res.send('<h1>experimento adicionado com sucesso!</h1>');
});
 
app.get('/experimento', (req, res) => {
    res.sendFile(path.join(__dirname, 'experimento.json'))
});
 
// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
    console.log('Servidor iniciado em http://localhost:' + port);
});
