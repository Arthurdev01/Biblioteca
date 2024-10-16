import express from 'express';
import cors from 'cors';
import categoriasRouter from '../src/routes_categorias.js';
import livroRouter from '../src/routes_livro.js';
import bibliotecaRouter from '../src/routes_biblioteca.js';
import usuarioRouter from '../src/routes_usuario.js';
import resenhaRouter from '../src/routes_resenha.js';

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8080;

// Atualização das rotas de acordo com as alterações
app.use('/api/categorias', categoriasRouter);
app.use('/api/livro', livroRouter);
app.use('/api/biblioteca', bibliotecaRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/resenha', resenhaRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

