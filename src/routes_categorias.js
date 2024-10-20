import express from 'express';
import client from '../config/db.js';

const categoriaRouter = express.Router();

categoriaRouter.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM categoria';
    
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

categoriaRouter.get('/:id_categoria', async (req, res) => {
  const { id_categoria } = req.params;

  if (id_categoria === undefined || isNaN(id_categoria)) {
    return res.status(400).json({ error: 'id_categoria é obrigatório e deve ser um número.' });
  }

  try {
    const query = `
      SELECT l.id_livro, l.titulo, l.autor, c.nome_categoria 
      FROM livro l
      JOIN categoria c ON l.id_categoria = c.id_categoria
      WHERE l.id_categoria = $1
    `;
    
    const result = await client.query(query, [id_categoria]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
});

export default categoriaRouter;
