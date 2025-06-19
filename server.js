// Passo 1: Importar os pacotes necessários
const express = require('express'); // O framework para criar o servidor
const cors = require('cors');       // Pacote para evitar erros de CORS (permissão de acesso)
const fs = require('fs').promises;  // Módulo 'File System' do Node.js para ler e escrever arquivos
const path = require('path');       // Módulo para lidar com caminhos de arquivos

// Passo 2: Configurações iniciais
const app = express(); // Inicia a aplicação Express
const PORT = 3000;     // Define a porta em que o servidor vai rodar
// --- LINHA ALTERADA ---
const DB_PATH = path.join(__dirname, 'db', 'db.json'); // Procura o db.json DENTRO da pasta 'db'

// Passo 3: Configurar os 'Middlewares'
// Middlewares são funções que rodam em todas as requisições antes das nossas rotas
app.use(cors());           // Habilita o CORS para permitir que seu frontend acesse o servidor
app.use(express.json());   // Faz com que o servidor entenda o formato JSON enviado nas requisições

// Static deve vir AQUI, antes das rotas e do listen!
app.use(express.static(path.join(__dirname, 'public')));

// --- FUNÇÕES AUXILIARES PARA LER E ESCREVER NO DB ---
const lerBancoDeDados = async () => {
    const dados = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(dados);
};

const escreverNoBancoDeDados = async (dados) => {
    // O 'null, 2' formata o JSON para ficar legível no arquivo
    await fs.writeFile(DB_PATH, JSON.stringify(dados, null, 2));
};

// --- ROTAS DA API (ENDPOINTS) ---

// Garante que o campo 'gastos' exista no banco de dados
async function garantirGastos(db) {
    if (!db.gastos) db.gastos = [];
}

// ROTA GET /metas: Retorna todas as metas
app.get('/metas', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        res.json(db.metas || []); // Retorna db.metas ou um array vazio se não existir
    } catch (error) {
        console.error('Erro ao ler o banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA GET /metas/:id: Retorna uma única meta pelo ID
app.get('/metas/:id', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        const meta = db.metas.find(m => m.id === req.params.id);
        if (meta) {
            res.json(meta);
        } else {
            res.status(404).send('Meta não encontrada.');
        }
    } catch (error) {
        console.error('Erro ao ler o banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA POST /metas: Cria uma nova meta
app.post('/metas', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        const novaMeta = {
            id: Date.now().toString(), // Cria um ID único baseado no tempo atual
            ...req.body                // Pega todos os dados enviados pelo formulário (nome, valor, etc.)
        };
        db.metas.push(novaMeta);
        await escreverNoBancoDeDados(db);
        res.status(201).json(novaMeta); // Responde com status 201 (Created) e a nova meta
    } catch (error) {
        console.error('Erro ao escrever no banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA PUT /metas/:id: Atualiza uma meta existente
app.put('/metas/:id', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        const index = db.metas.findIndex(m => m.id === req.params.id);

        if (index !== -1) {
            // Atualiza o objeto no array
            db.metas[index] = { id: req.params.id, ...req.body };
            await escreverNoBancoDeDados(db);
            res.json(db.metas[index]);
        } else {
            res.status(404).send('Meta não encontrada para atualizar.');
        }
    } catch (error) {
        console.error('Erro ao atualizar o banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA DELETE /metas/:id: Deleta uma meta
app.delete('/metas/:id', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        const metasAtualizadas = db.metas.filter(m => m.id !== req.params.id);

        // Verifica se alguma meta foi realmente removida
        if (db.metas.length !== metasAtualizadas.length) {
            db.metas = metasAtualizadas;
            await escreverNoBancoDeDados(db);
            res.status(204).send(); // Responde com 204 (No Content), sucesso na deleção
        } else {
            res.status(404).send('Meta não encontrada para deletar.');
        }
    } catch (error) {
        console.error('Erro ao deletar do banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA GET /gastos: Retorna todos os gastos
app.get('/gastos', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        await garantirGastos(db);
        res.json(db.gastos);
    } catch (error) {
        console.error('Erro ao ler o banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA POST /gastos: Cria um novo gasto
app.post('/gastos', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        await garantirGastos(db);
        const novoGasto = {
            id: Date.now().toString(),
            ...req.body
        };
        db.gastos.push(novoGasto);
        await escreverNoBancoDeDados(db);
        res.status(201).json(novoGasto);
    } catch (error) {
        console.error('Erro ao escrever no banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA PUT /gastos/:id: Atualiza um gasto existente
app.put('/gastos/:id', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        await garantirGastos(db);
        const index = db.gastos.findIndex(g => g.id === req.params.id);
        if (index !== -1) {
            db.gastos[index] = { id: req.params.id, ...req.body };
            await escreverNoBancoDeDados(db);
            res.json(db.gastos[index]);
        } else {
            res.status(404).send('Gasto não encontrado para atualizar.');
        }
    } catch (error) {
        console.error('Erro ao atualizar o banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// ROTA DELETE /gastos/:id: Deleta um gasto
app.delete('/gastos/:id', async (req, res) => {
    try {
        const db = await lerBancoDeDados();
        await garantirGastos(db);
        const gastosAtualizados = db.gastos.filter(g => g.id !== req.params.id);
        if (db.gastos.length !== gastosAtualizados.length) {
            db.gastos = gastosAtualizados;
            await escreverNoBancoDeDados(db);
            res.status(204).send();
        } else {
            res.status(404).send('Gasto não encontrado para deletar.');
        }
    } catch (error) {
        console.error('Erro ao deletar do banco de dados:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// Passo 4: Iniciar o servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando com sucesso em http://localhost:${PORT}`);
    console.log('Use Ctrl+C para parar o servidor.');
});