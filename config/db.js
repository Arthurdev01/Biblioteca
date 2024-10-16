import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: '1w2q3r4e',
  database: 'postgres',
  port: 5432,
});

client.connect();

export default client;
