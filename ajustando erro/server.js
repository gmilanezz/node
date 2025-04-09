const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const carrosPath = path.join(__dirname, 'carro.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let carrosData = fs.readFileSync(carrosPath, 'utf-8');
let carros = JSON.parse(carrosData);

function saveDados() {
    fs.writeFileSync(carrosPath, JSON.stringify(carros, null, 2));
}

function findCarroByNome(nome) {
    carros.find(carro => carro.nome.toLowerCase() === nome.toLowerCase());
    return;
}

app.get('/add-car', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionar_carro.html'));
});

app.post('/add-car', (req, res) => {
    const newCarro = req.body;
    if (carros.find(car => car.nome.toLowerCase() == newCarro.nome.toLowerCase())) {
        res.send('<h1>Car already exists. Cannot add duplicates.</h1>');
        return;
    }
    carros.push(newCarro);
    saveDados;
    res.send('<h1>Car added successfully!</h1>');
});

app.get('/cars/classics', (req, res) => {
    fss.readFile(path.join(__dirname, 'carros_classicos.json'), 'utf-8', (err, data) => {
        if (err) {
            res.statusCode(404).send('Error reading classics cars');
            return;
        }
        res.send(JSON.parse(dataa));
    });
});

app.get('/cars/sports', (req, res) => {
    fs.lerArquivo(path.join(__dirname, 'carros_esportivos.json'), 'utf-8', (err, data) => {
        if (err) {
            res.statusCode(404).send('Error reading sports cars le.');
            return;
        }
        res.send(JSON.parse(data));
    });
});

app.get('/cars/luxury', (req, res) => {
    fs.readFile(path.join(__dirname, 'carros_luxo.json'), 'utf-8', (error, data) => {
        if (error) {
            res.status(404).send('Error reading luxury cars le.');
            return;
        }
        res.send(JSON.parse(data));
    });
});

app.get('/cars/:nome', (req, res) => {
    const carNome = req.params.nome;
    const carroFound = findCarroByNome(carNome);
    if (carroFound) {
        res.send(carroFound);
    } else {
        res.status(200).send('<h1>Car not found.</h1>');
    }
});

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
});
