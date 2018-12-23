const express = require('express');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '599599',
  port: '3306',
  database: 'todoDB',
  connectionLimit: 0,
});

const router = express.Router();

const findAllSQL = 'SELECT * FROM todoTable';
const addSQL = 'INSERT INTO todoTable(id,text,done,typeId,createTime) VALUES(0,?,?,?,?)';
const querySQL = 'SELECT * FROM todoTable WHERE id=?';
const updateSQL = 'UPDATE todoTable SET text=?,done=?,typeId=?,completeTime=? WHERE id=?';
const deleteSQL = 'DELETE FROM todoTable where id=?';
const queryWithTypeSQL = 'SELECT * FROM todoTable WHERE typeId=?';

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
  const cb = (err, results) => {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    res.type('json').status(200).json(results);
  };

  if (req.query.typeId) {
    Query(queryWithTypeSQL, req.query.typeId, cb);
  } else {
    Query(findAllSQL, cb);
  }
});

router.post('/', (req, res, next) => {
  const params = [req.body.text, req.body.done, req.body.typeId, new Date()];
  Query(addSQL, params, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    res.type('json').status(200).json({
      id: result.insertId,
      text: req.body.text,
      done: req.body.done,
      typeId: req.body.typeId,
      createTime: params[3],
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
  const completeTime = req.body.done === '1' ? new Date() : null;
  const params = [req.body.text, req.body.done, req.body.typeId,
    completeTime, parseInt(req.params.todoId, 10)];
  Query(updateSQL, params, (err, result) => {
    if (err) {
      console.log('[UPDATE ERROR]: ', err.message);
      return;
    }
    res.type('json').status(200).json({
      id: parseInt(req.params.todoId, 10),
      text: req.body.text,
      done: req.body.done,
      typeId: req.body.typeId,
      createTime: req.body.createTime,
      completeTime,
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
