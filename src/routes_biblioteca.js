import express from 'express';
import client from '../config/db.js';

const bibliotecaRouter = express.Router();

bibliotecaRouter.get('/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ error: 'O ID do usuário é obrigatório.' });
  }

  try {
    const result = await client.query(
      `SELECT livro.*, c.nome_categoria, 
              COALESCE(json_agg(json_build_object(
                'id_resenha', resenha.id_resenha,
                'nota', resenha.nota,
                'comentario', resenha.comentario,
                'data_resenha', resenha.data_resenha
              )) FILTER (WHERE resenha.id_resenha IS NOT NULL), '[]') AS resenhas
       FROM livro 
       JOIN biblioteca ON livro.id_biblioteca = biblioteca.id_biblioteca 
       JOIN categoria c ON livro.id_categoria = c.id_categoria 
       LEFT JOIN resenha ON livro.id_livro = resenha.id_livro
       WHERE biblioteca.id_usuario = $1
       GROUP BY livro.id_livro, c.nome_categoria`,
      [id_usuario]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar livros da biblioteca' });
  }
});


bibliotecaRouter.get('/:id_usuario/livros/categoria/:id_categoria', async (req, res) => { 
  const { id_usuario, id_categoria } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ error: 'O ID do usuário é obrigatório.' });
  }
  
  if (!id_categoria) {
    return res.status(400).json({ error: 'O ID da categoria é obrigatório.' });
  }

  try {
    const result = await client.query(
      `SELECT livro.*, c.nome_categoria,
              COALESCE(json_agg(json_build_object(
                'id_resenha', resenha.id_resenha,
                'nota', resenha.nota,
                'comentario', resenha.comentario,
                'data_resenha', resenha.data_resenha
              )) FILTER (WHERE resenha.id_resenha IS NOT NULL), '[]') AS resenhas
       FROM livro 
       JOIN biblioteca ON livro.id_biblioteca = biblioteca.id_biblioteca 
       JOIN categoria c ON livro.id_categoria = c.id_categoria 
       LEFT JOIN resenha ON livro.id_livro = resenha.id_livro
       WHERE biblioteca.id_usuario = $1 AND livro.id_categoria = $2
       GROUP BY livro.id_livro, c.nome_categoria`,
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
