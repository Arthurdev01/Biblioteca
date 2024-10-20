import express from 'express';
import client from '../config/db.js';
import categoriaRouter from './routes_categorias.js'

const router = express.Router();

router.use('/categorias', categoriaRouter);

router.post('/livro', async (req, res) => {
  const { id_biblioteca, id_categoria, autor, titulo, data_inclusao } = req.body;
  try {

    const bibliotecaResult = await client.query('SELECT * FROM biblioteca WHERE id_biblioteca = $1', [id_biblioteca]);
    if (bibliotecaResult.rows.length === 0) {
      return res.status(400).json({ error: 'Biblioteca não encontrada' });
    }


    const livroResult = await client.query(
      'INSERT INTO livro (id_biblioteca, id_categoria, autor, titulo, data_inclusao) VALUES ($1, $2, $3, $4, $5) RETURNING id_livro',
      [id_biblioteca, id_categoria, autor, titulo, data_inclusao || new Date()]
    );
    res.status(201).json(livroResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar livro' });
  }
});

router.get('/livro/:id_livro', async (req, res) => {
  const { id_livro } = req.params;
  try {
    const livroResult = await client.query(
      'SELECT * FROM livro WHERE id_livro = $1',
      [id_livro]
    );
    const resenhasResult = await client.query(
      'SELECT * FROM resenha WHERE id_livro = $1',
      [id_livro]
    );
    res.json({ livro: livroResult.rows[0], resenhas: resenhasResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar detalhes do livro' });
  }
});

router.put('/livro/:id_livro', async (req, res) => {
  const { id_livro } = req.params;
  const { id_categoria, autor, titulo } = req.body; 
  try {
    const result = await client.query(
      'UPDATE livro SET id_categoria = $1, autor = $2, titulo = $3 WHERE id_livro = $4 RETURNING *',
      [id_categoria, autor, titulo, id_livro]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
});
export default router;




