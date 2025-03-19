var http = require('http');
var url = require('url');
var fs = require('fs');


function readFile(response,file){
    fs.readFile(file, function(err,data){
        responde.end(data)
    })
}

function callback(request, response) {
    response.writeHead(200, {'Content Type': 'application/json; charset=utf-8'})

    var parts = url.parse(request.url);
    var path = parts.path

    if(path == 'loja/produtos'){
        readFile(response, 'loja_produtos.json')
    } else if (path == 'loja/pedidos') {
        readFile(response, 'loja_pedidos.json')
    } else if (path == 'loja/clientes') {
        readFile(response, 'loja_clientes.json')
    } else if (path == 'loja/categorias') {
        readFile(response, 'loja_categorias.json')
    } else {
        response.end('Caminho não encontrado: ' + path)
    }

    var server = http.createServer(callback);
    server.listen(3000);
    console.log('Servidor iniciado em http://localhost:3000/');
}
