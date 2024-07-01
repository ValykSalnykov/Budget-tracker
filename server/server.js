const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Конфигурация подключения к базе данных
const dbConfig = {
  host: process.env.DB_HOST || 'sql7.freemysqlhosting.net',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'sql7716884',
  password: process.env.DB_PASSWORD || 'VvVv4815162342!',
  database: process.env.DB_NAME || 'sql7716884'
};

// Функция для получения подключения к базе данных
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Проверка подключения к базе данных
app.get('/api/db-status', async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.ping();
    await connection.end();
    res.json({ status: 'connected' });
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    res.status(500).json({ status: 'disconnected', error: error.message });
  }
});

// Получение всех бюджетных записей
app.get('/api/budget-items', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM budget_items');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении бюджетных записей:', error);
    res.status(500).json({ error: error.message });
  }
});

// Создание новой бюджетной записи
app.post('/api/budget-items', async (req, res) => {
  try {
    const { name, amount, type, week_index } = req.body;
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO budget_items (name, amount, type, week_index) VALUES (?, ?, ?, ?)',
      [name, amount, type, week_index]
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, name, amount, type, week_index });
  } catch (error) {
    console.error('Ошибка при создании бюджетной записи:', error);
    res.status(500).json({ error: error.message });
  }
});

// Обновление бюджетной записи
app.put('/api/budget-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, type, week_index } = req.body;
    const connection = await getConnection();
    await connection.execute(
      'UPDATE budget_items SET name = ?, amount = ?, type = ?, week_index = ? WHERE id = ?',
      [name, amount, type, week_index, id]
    );
    await connection.end();
    res.json({ id, name, amount, type, week_index });
  } catch (error) {
    console.error('Ошибка при обновлении бюджетной записи:', error);
    res.status(500).json({ error: error.message });
  }
});

// Удаление бюджетной записи
app.delete('/api/budget-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    await connection.execute('DELETE FROM budget_items WHERE id = ?', [id]);
    await connection.end();
    res.json({ message: 'Запись успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении бюджетной записи:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});