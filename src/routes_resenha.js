import express from 'express';
import client from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => { 
  const { id_livro, nota, comentario } = req.body;

  if (!id_livro || nota === undefined || !comentario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  if (nota < 1 || nota > 5) {
    return res.status(400).json({ error: 'A nota deve estar entre 1 e 5.' });
  }

  try {
    const livroResult = await client.query('SELECT * FROM livro WHERE id_livro = $1', [id_livro]);
    if (livroResult.rows.length === 0) {
      return res.status(400).json({ error: 'Livro não encontrado' });
    }

    const resenhaExistente = await client.query(
      'SELECT * FROM resenha WHERE id_livro = $1',
      [id_livro]
    );

    if (resenhaExistente.rows.length > 0) {
      return res.status(400).json({ error: 'Você já adicionou uma resenha para este livro.' });
    }

    const result = await client.query(
      'INSERT INTO resenha (id_livro, nota, comentario, data_resenha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *',
      [id_livro, nota, comentario]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar resenha' });
  }
});


router.get('/:id_resenha', async (req, res) => {
  const { id_resenha } = req.params;

  try {
    const result = await client.query(
      'SELECT * FROM resenha WHERE id_resenha = $1', 
      [id_resenha]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resenha não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar resenha' });
  }
});


router.put('/:id_resenha', async (req, res) => {
  const { id_resenha } = req.params;
  const { nota, comentario } = req.body; 

  try {

    const resenhaAntiga = await client.query(
      'SELECT * FROM resenha WHERE id_resenha = $1', 
      [id_resenha]
    );

    if (resenhaAntiga.rows.length === 0) {
      return res.status(404).json({ error: 'Resenha não encontrada' });
    }


    const result = await client.query(
      'UPDATE resenha SET nota = $1, comentario = $2, data_resenha = CURRENT_TIMESTAMP WHERE id_resenha = $3 RETURNING *', 
      [nota, comentario, id_resenha]
    );


    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar resenha' });
  }
});

export default router;
