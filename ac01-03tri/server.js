const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';
const dbName = 'controle_medicamentos';

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(url)
    .then(client => {
        const db = client.db(dbName);
        const pacientesCol = db.collection('pacientes');
        const medicamentosCol = db.collection('medicamentos');
        const vendasCol = db.collection('vendas');

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        app.get('/pacientes', async (req, res) => {
            const pacientes = await pacientesCol.find().toArray();
            let tabela = `
      <html><head><title>Pacientes</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head><body class="container mt-4">
      <h1>Pacientes</h1>
      <a href="/pacientes/cadastro" class="btn btn-success mb-3">Novo Paciente</a>
      <table class="table table-striped"><thead><tr>
      <th>Nome</th><th>Data Nasc.</th><th>cpf</th><th>Ações</th>
      </tr></thead><tbody>`;
            pacientes.forEach(p => {
                tabela += `
        <tr>
          <td>${p.nome}</td>
          <td>${p.dataNascimento || '—'}</td>
          <td>${p.cpf || '—'}</td>
          <td>
            <a href="/pacientes/atualizar/${p._id}" class="btn btn-sm btn-primary">Editar</a>
            <form action="/pacientes/${p._id}?_method=DELETE" method="POST" style="display:inline-block;">
              <button class="btn btn-sm btn-danger">Excluir</button>
            </form>
          </td>
        </tr>`;
            });
            tabela += `</tbody></table><a href="/" class="btn btn-secondary">Voltar</a></body></html>`;
            res.send(tabela);
        });

        app.get('/pacientes/cadastro', (req, res) => {
            res.sendFile(path.join(__dirname, 'pacientes', 'cadastroPaciente.html'));
        });

        app.post('/pacientes', async (req, res) => {
            const { nome, dataNascimento, cpf } = req.body;
            await pacientesCol.insertOne({ nome, dataNascimento, cpf });
            res.redirect('/pacientes');
        });

        app.get('/pacientes/atualizar/:id', async (req, res) => {
            const id = req.params.id;
            const paciente = await pacientesCol.findOne({ _id: new ObjectId(id) });
            if (!paciente) return res.send('Paciente não encontrado');
            res.send(`
        <html><head><title>Atualizar Paciente</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head><body class="container mt-4">
        <h1>Atualizar Paciente</h1>
        <form action="/pacientes/${paciente._id}?_method=PUT" method="POST">
          <div class="mb-3"><label class="form-label">Nome</label>
          <input type="text" name="nome" class="form-control" value="${paciente.nome}" required></div>
          <div class="mb-3"><label class="form-label">Data de Nascimento</label>
          <input type="date" name="dataNascimento" class="form-control" value="${paciente.dataNascimento || ''}"></div>
          <div class="mb-3"><label class="form-label">cpf</label>
          <input type="text" name="cpf" class="form-control" value="${paciente.cpf || ''}"></div>
          <button class="btn btn-primary">Atualizar</button>
          <a href="/pacientes" class="btn btn-secondary">Cancelar</a>
        </form></body></html>`);
        });

        app.put('/pacientes/:id', async (req, res) => {
            const id = req.params.id;
            const { nome, dataNascimento, cpf } = req.body;
            await pacientesCol.updateOne(
                { _id: new ObjectId(id) },
                { $set: { nome, dataNascimento, cpf } }
            );
            res.redirect('/pacientes');
        });

        app.delete('/pacientes/:id', async (req, res) => {
            const id = req.params.id;
            await pacientesCol.deleteOne({ _id: new ObjectId(id) });
            res.redirect('/pacientes');
        });

        app.get('/medicamentos', async (req, res) => {
            const medicamentos = await medicamentosCol.find().toArray();
            let tabela = `
      <html><head><title>Medicamentos</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head><body class="container mt-4">
      <h1>Medicamentos</h1>
      <a href="/medicamentos/cadastro" class="btn btn-success mb-3">Novo Medicamento</a>
      <table class="table table-striped"><thead><tr>
      <th>Nome</th><th>Código</th><th>Dosagem</th><th>Ações</th>
      </tr></thead><tbody>`;
            medicamentos.forEach(m => {
                tabela += `
        <tr>
          <td>${m.nome}</td>
          <td>${m.codigoRegistro || '—'}</td>
          <td>${m.dosagem || '—'}</td>
          <td>
            <a href="/medicamentos/atualizar/${m._id}" class="btn btn-sm btn-primary">Editar</a>
            <form action="/medicamentos/${m._id}?_method=DELETE" method="POST" style="display:inline-block;">
              <button class="btn btn-sm btn-danger">Excluir</button>
            </form>
          </td>
        </tr>`;
            });
            tabela += `</tbody></table><a href="/" class="btn btn-secondary">Voltar</a></body></html>`;
            res.send(tabela);
        });

        app.get('/medicamentos/cadastro', (req, res) => {
            res.sendFile(path.join(__dirname, 'medicamentos', 'cadastroMedicamentos.html'));
        });

        app.post('/medicamentos', async (req, res) => {
            const { nome, codigoRegistro, dosagem } = req.body;
            await medicamentosCol.insertOne({ nome, codigoRegistro, dosagem });
            res.redirect('/medicamentos');
        });

        app.get('/medicamentos/atualizar/:id', async (req, res) => {
            const id = req.params.id;
            const medicamento = await medicamentosCol.findOne({ _id: new ObjectId(id) });
            if (!medicamento) return res.send('Medicamento não encontrado');
            res.send(`
        <html><head><title>Atualizar Medicamento</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head><body class="container mt-4">
        <h1>Atualizar Medicamento</h1>
        <form action="/medicamentos/${medicamento._id}?_method=PUT" method="POST">
          <div class="mb-3"><label class="form-label">Nome</label>
          <input type="text" name="nome" class="form-control" value="${medicamento.nome}" required></div>
          <div class="mb-3"><label class="form-label">Código</label>
          <input type="text" name="codigoRegistro" class="form-control" value="${medicamento.codigoRegistro || ''}"></div>
          <div class="mb-3"><label class="form-label">Dosagem</label>
          <input type="text" name="dosagem" class="form-control" value="${medicamento.dosagem || ''}"></div>
          <button class="btn btn-primary">Atualizar</button>
          <a href="/medicamentos" class="btn btn-secondary">Cancelar</a>
        </form></body></html>`);
        });

        app.put('/medicamentos/:id', async (req, res) => {
            const id = req.params.id;
            const { nome, codigoRegistro, dosagem } = req.body;
            await medicamentosCol.updateOne(
                { _id: new ObjectId(id) },
                { $set: { nome, codigoRegistro, dosagem } }
            );
            res.redirect('/medicamentos');
        });

        app.delete('/medicamentos/:id', async (req, res) => {
            const id = req.params.id;
            await medicamentosCol.deleteOne({ _id: new ObjectId(id) });
            res.redirect('/medicamentos');
        });

        app.get('/vendas', async (req, res) => {
            const vendas = await vendasCol.find().toArray();
            const pacientes = await pacientesCol.find().toArray();
            const medicamentos = await medicamentosCol.find().toArray();
            const pacMap = {};
            const medMap = {};
            pacientes.forEach(p => pacMap[p._id.toString()] = p);
            medicamentos.forEach(m => medMap[m._id.toString()] = m);
            let tabela = `
      <html><head><title>Vendas</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head><body class="container mt-4">
      <h1>Vendas</h1>
      <a href="/vendas/cadastro" class="btn btn-success mb-3">Nova Venda</a>
      <table class="table table-striped"><thead><tr>
      <th>Data</th><th>Paciente</th><th>Medicamento</th><th>Quantidade</th><th>Ações</th>
      </tr></thead><tbody>`;
            vendas.forEach(v => {
                const paciente = v.pacienteId ? pacMap[v.pacienteId.toString()] : null;
                const medicamento = v.medicamentoId ? medMap[v.medicamentoId.toString()] : null;
                tabela += `
        <tr>
          <td>${v.dataCompra || '—'}</td>
          <td>${paciente ? paciente.nome : '—'}</td>
          <td>${medicamento ? medicamento.nome : '—'}</td>
          <td>${v.quantidade || 0}</td>
          <td>
            <a href="/vendas/atualizar/${v._id}" class="btn btn-sm btn-primary">Editar</a>
            <form action="/vendas/${v._id}?_method=DELETE" method="POST" style="display:inline-block;">
              <button class="btn btn-sm btn-danger">Excluir</button>
            </form>
          </td>
        </tr>`;
            });
            tabela += `</tbody></table><a href="/" class="btn btn-secondary">Voltar</a></body></html>`;
            res.send(tabela);
        });

        app.get('/vendas/cadastro', async (req, res) => {
            const pacientes = await pacientesCol.find().toArray();
            const medicamentos = await medicamentosCol.find().toArray();
            let form = `
      <html><head><title>Nova Venda</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head><body class="container mt-4">
      <h1>Nova Venda</h1>
      <form action="/vendas" method="POST">
      <div class="mb-3"><label class="form-label">Data</label>
      <input type="date" name="dataCompra" class="form-control"></div>
      <div class="mb-3"><label class="form-label">Paciente</label>
      <select name="pacienteId" class="form-control" required>
      <option value="">Selecione</option>`;
            pacientes.forEach(p => form += `<option value="${p._id}">${p.nome}</option>`);
            form += `</select></div>
      <div class="mb-3"><label class="form-label">Medicamento</label>
      <select name="medicamentoId" class="form-control" required>
      <option value="">Selecione</option>`;
            medicamentos.forEach(m => form += `<option value="${m._id}">${m.nome}</option>`);
            form += `</select></div>
      <div class="mb-3"><label class="form-label">Quantidade</label>
      <input type="number" name="quantidade" class="form-control" value="1" min="1"></div>
      <button class="btn btn-success">Salvar</button>
      <a href="/vendas" class="btn btn-secondary">Cancelar</a>
      </form></body></html>`;
            res.send(form);
        });

        app.post('/vendas', async (req, res) => {
            const { dataCompra, pacienteId, medicamentoId, quantidade } = req.body;
            await vendasCol.insertOne({
                dataCompra,
                pacienteId: pacienteId ? new ObjectId(pacienteId) : null,
                medicamentoId: medicamentoId ? new ObjectId(medicamentoId) : null,
                quantidade: Number(quantidade)
            });
            res.redirect('/vendas');
        });

        app.get('/vendas/atualizar/:id', async (req, res) => {
            const id = req.params.id;
            const venda = await vendasCol.findOne({ _id: new ObjectId(id) });
            const pacientes = await pacientesCol.find().toArray();
            const medicamentos = await medicamentosCol.find().toArray();
            if (!venda) return res.send('Venda não encontrada');
            let form = `
      <html><head><title>Editar Venda</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head><body class="container mt-4">
      <h1>Editar Venda</h1>
      <form action="/vendas/${venda._id}?_method=PUT" method="POST">
      <div class="mb-3"><label class="form-label">Data</label>
      <input type="date" name="dataCompra" class="form-control" value="${venda.dataCompra || ''}"></div>
      <div class="mb-3"><label class="form-label">Paciente</label>
      <select name="pacienteId" class="form-control" required>`;
            pacientes.forEach(p => {
                form += `<option value="${p._id}" ${venda.pacienteId && venda.pacienteId.toString() === p._id.toString() ? 'selected' : ''}>${p.nome}</option>`;
            });
            form += `</select></div>
      <div class="mb-3"><label class="form-label">Medicamento</label>
      <select name="medicamentoId" class="form-control" required>`;
            medicamentos.forEach(m => {
                form += `<option value="${m._id}" ${venda.medicamentoId && venda.medicamentoId.toString() === m._id.toString() ? 'selected' : ''}>${m.nome}</option>`;
            });
            form += `</select></div>
      <div class="mb-3"><label class="form-label">Quantidade</label>
      <input type="number" name="quantidade" class="form-control" value="${venda.quantidade || 1}" min="1"></div>
      <button class="btn btn-primary">Atualizar</button>
      <a href="/vendas" class="btn btn-secondary">Cancelar</a>
      </form></body></html>`;
            res.send(form);
        });

        app.put('/vendas/:id', async (req, res) => {
            const id = req.params.id;
            const { dataCompra, pacienteId, medicamentoId, quantidade } = req.body;
            await vendasCol.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        dataCompra,
                        pacienteId: pacienteId ? new ObjectId(pacienteId) : null,
                        medicamentoId: medicamentoId ? new ObjectId(medicamentoId) : null,
                        quantidade: Number(quantidade)
                    }
                }
            );
            res.redirect('/vendas');
        });

        app.delete('/vendas/:id', async (req, res) => {
            const id = req.params.id;
            await vendasCol.deleteOne({ _id: new ObjectId(id) });
            res.redirect('/vendas');
        });

        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });
    })
    .catch(err => console.error(err));