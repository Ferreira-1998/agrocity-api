// Importa as dependências necessárias
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para analisar o corpo da requisição
app.use(bodyParser.json());

// Configuração do banco de dados
const dbConfig = {
  user: 'agrocity',
  password: 'Ma87551233@',
  server: 'agrocity.database.windows.net',
  database: 'agrocity',
  options: {
    encrypt: true, // Requisito para Azure SQL
    trustServerCertificate: false
  }
};

// Rota de autenticação de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
  }

  try {
    // Conecta ao banco de dados
    await sql.connect(dbConfig);

    // Executa a query para verificar as credenciais
    const result = await sql.query(
      `SELECT COUNT(*) AS count FROM dbo.Usuarios WHERE Email = '${email}' AND Password = '${senha}'`
    );

    if (result.recordset[0].count > 0) {
      res.status(200).json({ success: true, message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
    }
  } catch (err) {
    console.error('Erro ao conectar ou executar a query:', err);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`API intermediária rodando na porta ${port}`);
});
