import express from 'express';
import bcrypt from 'bcrypt';
import client from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => { 
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const emailCheck = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email já em uso.' });
    }

    const result = await client.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id_usuario',
      [nome, email, hashedPassword]
    );
    const userId = result.rows[0].id_usuario; 

    await client.query(
      'INSERT INTO biblioteca (id_usuario) VALUES ($1)',
      [userId]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const result = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;





