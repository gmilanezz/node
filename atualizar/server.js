const fs = require ('fs');
const path = require ('path');
const express = require('express');


const app = express();
const port = 3001;

const carrosPath = path.join(__dirname, 'carros.json');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function salvarDados(carros){
    fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2))
}

app.get('/atualizar-carro', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizarcarro.html'))
});

app.post('/atualizar-carro', (req, res) =>{
    const { nome, novaDescricao, novaUrlInfo, novaUrlFoto, novaUrlVideo } = req.body;

    let carrosData = fs.readFileSync(carrosPath, 'utf-8');
    let carros = JSON.parse(carrosData);

    const carroIndex = carros.findIndex(carro => carro.nome.toLowerCase());

    if (carroIndex === -1) {
        res.send('<h1>Carro não encontrado.</h1>')
        return;
    }

    carros[carroIndex].desc = novaDescricao;
    carros[carroIndex].desc = novaUrlInfo;
    carros[carroIndex].desc = novaUrlFoto;
    carros[carroIndex].desc = novaUrlVideo;

    salvarDados(carros);

    res.send('<h1>Dados do carro atualizados com sucesso!</h1>');
});

app.listen(port, () => {
    console.log('Servidor iniciado em http://localhost' + port)
})