const express = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '599599',
  port: '3306',
  database: 'todoDB',
});

connection.connect();

const router = express.Router();

const findAllSQL = 'SELECT * FROM todoTable';
const addSQL = 'INSERT INTO todoTable(id,text,done) VALUES(0,?,?)';
const querySQL = 'SELECT * FROM todoTable WHERE id=?';
const updateSQL = 'UPDATE todoTable SET text=?,done=? WHERE id=?';
const deleteSQL = 'DELETE FROM todoTable where id=?';

router.get('/', (req, res, next) => {
  connection.query(findAllSQL, (err, result) => {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    res.send(result);
  });
});

router.post('/', (req, res, next) => {
  const params = [req.body.text, req.body.done];
  connection.query(addSQL, params, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    res.send(params);
  });
});

router.get('/:todoId', (req, res, next) => {
  connection.query(querySQL, req.params.todoId, (err, result) => {
    if (err) {
      console.log('[QUERY ERROR]: ', err.message);
      return;
    }
    res.send(result);
  });
});

router.put('/:todoId', (req, res, next) => {
  const params = [req.body.text, req.body.done, parseInt(req.params.todoId, 10)];
  connection.query(updateSQL, params, (err, result) => {
    if (err) {
      console.log('[UPDATE ERROR]: ', err.message);
      return;
    }
    res.send(params);
  });
});

router.delete('/:todoId', (req, res, next) => {
  connection.query(deleteSQL, parseInt(req.params.todoId, 10), (err, result) => {
    if (err) {
      console.log('[DELETE ERROR]: ', err.message);
      return;
    }
    res.send(req.params.todoId);
  });
});

// connection.end();

module.exports = router;
