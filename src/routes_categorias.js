import express from 'express';
import client from '../config/db.js';

const categoriaRouter = express.Router();

// Endpoint para buscar todas as categorias
categoriaRouter.get('/', async (req, res) => { 
  try {
    const result = await client.query('SELECT * FROM categoria');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

export default categoriaRouter;


