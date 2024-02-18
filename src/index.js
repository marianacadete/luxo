const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://ltspppgc:UMOKs-nCSCSmc8LerkSY9JQS9aThHsdn@silly.db.elephantsql.com/ltspppgc'
});

const app = express();

app.use(express.json());
app.use(cors());

// Consultar quartos
app.get('/quartos', async (req, resp) => {
  try {
    const { rows } = await pool.query('SELECT * FROM quartos');
    return resp.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inserir quarto
app.post('/quartos', async (req, res) => {
  const { titulo, descricao, preco_por_noite } = req.body;
  try {
    if (!titulo || !descricao || !preco_por_noite) {
      return res.status(400).json({ error: 'Os campos são obrigatórios.' });
    }

    const newQuarto = await pool.query(
      'INSERT INTO quartos (titulo, descricao, preco_por_noite) VALUES ($1, $2, $3) RETURNING *',
      [titulo, descricao, preco_por_noite]
    );
    return res.status(201).json(newQuarto.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server Running on port ${PORT}`);
});