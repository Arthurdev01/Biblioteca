import express from 'express';
import client from '../config/db.js';

const bibliotecaRouter = express.Router();

// Rota para obter todos os livros de uma biblioteca de um usuário
bibliotecaRouter.get('/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await client.query(
      `SELECT livro.* 
       FROM livro 
       JOIN biblioteca ON livro.id_biblioteca = biblioteca.id_biblioteca 
       WHERE biblioteca.id_usuario = $1`,
      [id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar livros da biblioteca' });
  }
});
// Endpoint para filtrar livros por categoria
bibliotecaRouter.get('/:id_usuario/livros/categoria/:id_categoria', async (req, res) => {
  const { id_usuario, id_categoria } = req.params;

  try {
    const result = await client.query(
      `SELECT livro.* 
       FROM livro 
       JOIN biblioteca ON livro.id_biblioteca = biblioteca.id_biblioteca 
       WHERE biblioteca.id_usuario = $1 AND livro.id_categoria = $2`,
      [id_usuario, id_categoria]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum livro encontrado para essa categoria' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar livros por categoria' });
  }
});
export default bibliotecaRouter;





