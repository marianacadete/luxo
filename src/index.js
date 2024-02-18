const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');


const PORT = process.env.PORT || 3333;

const pool = new Pool ({
    connectionString: 'postgres://ltspppgc:UMOKs-nCSCSmc8LerkSY9JQS9aThHsdn@silly.db.elephantsql.com/ltspppgc'
})

const app = express();

app.use(express.json());
app.use(cors());

//consultar quarto
app.get('/quartos', async(req,resp) => {
    try {
        const {rows} = await pool.query('select * from quartos')
        return resp.status(200).send(rows)
        } catch (err) {
        return resp.status(400).send(err)
        }
})

//inserir quarto
app.post('/quartos', async (req,res) => {
    const {titulo, descricao, preco_por_noite } = req.body;
    try {
        if (!titulo || !descricao || !preco_por_noite) {
                return res.status(400).send("Os campos são obrigatórios.");            
        }

        const newQuarto= await pool.query('INSERT INTO quartos (titulo, descricao, preco_por_noite) VALUES ($1, $2, $3) RETURNING *', [titulo, descricao, preco_por_noite]);
        return res.status(200).send(newQuartos.rows);
    } catch(err) {
        return res.status(400).send(err);
    }
    

})






app.listen(PORT, () => console.log (`Server is running on port $(PORT)`));