const express = require('express');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '599599',
  port: '3306',
  database: 'todoDB',
});

const router = express.Router();

const findAllSQL = 'SELECT * FROM todoTable';
const addSQL = 'INSERT INTO todoTable(id,text,done) VALUES(0,?,?)';
const querySQL = 'SELECT * FROM todoTable WHERE id=?';
const updateSQL = 'UPDATE todoTable SET text=?,done=? WHERE id=?';
const deleteSQL = 'DELETE FROM todoTable where id=?';

const Query = (sql, options, cb) => {
  pool.getConnection((err, conn) => {
    if (err) {
      cb(err, null, null);
    } else {
      conn.query(sql, options, (e, results, fields) => {
        conn.release();
        cb(e, results, fields);
      });
    }
  });
};

router.get('/', (req, res, next) => {
  Query(findAllSQL, (err, results) => {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    res.type('json').status(200).json(results);
  });
});

router.post('/', (req, res, next) => {
  const params = [req.body.text, req.body.done];
  Query(addSQL, params, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    res.type('json').status(200).json({
      id: result.insertId,
      text: req.body.text,
      done: req.body.done,
    });
  });
});

router.get('/:todoId', (req, res, next) => {
  Query(querySQL, req.params.todoId, (err, result) => {
    if (err) {
      console.log('[QUERY ERROR]: ', err.message);
      return;
    }
    res.type('json').status(200).json(result[0]);
  });
});

router.put('/:todoId', (req, res, next) => {
  const params = [req.body.text, req.body.done, parseInt(req.params.todoId, 10)];
  Query(updateSQL, params, (err, result) => {
    if (err) {
      console.log('[UPDATE ERROR]: ', err.message);
      return;
    }
    res.type('json').status(200).json({
      id: params[2],
      text: params[0],
      done: params[1],
    });
  });
});

router.delete('/:todoId', (req, res, next) => {
  Query(deleteSQL, parseInt(req.params.todoId, 10), (err, result) => {
    if (err) {
      console.log('[DELETE ERROR]: ', err.message);
      return;
    }
    res.type('json').status(200).json({ id: parseInt(req.params.todoId, 10) });
  });
});

module.exports = router;
