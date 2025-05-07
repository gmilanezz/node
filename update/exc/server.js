const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const produtosPath = path.join(__dirname, 'produtos.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para salvar os dados atualizados no arquivo JSON
function salvarDados(produtos) {
    fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));
}

// Rota para exibir o formulário HTML para atualizar os dados do produto
app.get('/atualizar-produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para processar a requisição POST do formulário e atualizar os dados do produto
app.post('/atualizar-produto', (req, res) => {
    const { nome, qnt, novoPreco} = req.body;

    // Lendo os dados do arquivo JSON
    let produtosData = fs.readFileSync(produtosPath, 'utf-8');
    let produtos = JSON.parse(produtosData);

    // Procurando o produto pelo nome
    const produtoIndex = produtos.findIndex(produto => produto.nome.toLowerCase() === nome.toLowerCase());

    // Verificando se o produto existe
    if (produtoIndex === -1) {
        res.send('<h1>produto não encontrado.</h1>');
        return;
    }

    // Atualizando os dados do produto
    produto[produtoIndex].preco = novoPreco;

    // Salvando os dados atualizados no arquivo JSON
    salvarDados(produtos);

    // Enviando uma resposta indicando que os dados foram atualizados com sucesso
    res.send('<h1>Dados do produto atualizados com sucesso!</h1>');
});

// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
    console.log('Servidor iniciado em http://localhost:' + port);
});