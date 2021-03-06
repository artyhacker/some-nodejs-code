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

const findAllSQL = 'SELECT * FROM typeTable';
const addSQL = 'INSERT INTO typeTable(id,name,layer,pId) VALUES(0,?,?,?)';
const querySQL = 'SELECT * FROM typeTable WHERE id=?';
const updateSQL = 'UPDATE typeTable SET name=?,layer=?,pId=? WHERE id=?';
const deleteSQL = 'DELETE FROM typeTable where id=?';

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
  const params = [req.body.name, req.body.layer, req.body.pId];
  Query(addSQL, params, (err, result) => {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    res.type('json').status(200).json({
      id: result.insertId,
      name: req.body.name,
      layer: req.body.layer,
      pId: req.body.pId,
    });
  });
});

router.get('/:typeId', (req, res, next) => {
  Query(querySQL, req.params.typeId, (err, result) => {
    if (err) {
      console.log('[QUERY ERROR]: ', err.message);
      return;
    }
    res.type('json').status(200).json(result[0]);
  });
});

router.put('/:typeId', (req, res, next) => {
  const params = [req.body.name, req.body.layer, req.body.pId, parseInt(req.params.typeId, 10)];
  Query(updateSQL, params, (err, result) => {
    if (err) {
      console.log('[UPDATE ERROR]: ', err.message);
      return;
    }
    res.type('json').status(200).json({
      id: parseInt(req.params.typeId, 10),
      name: params[0],
      layer: params[1],
      pId: params[2],
    });
  });
});

router.delete('/:typeId', (req, res, next) => {
  Query(deleteSQL, parseInt(req.params.typeId, 10), (err, result) => {
    if (err) {
      console.log('[DELETE ERROR]: ', err.message);
      return;
    }
    res.type('json').status(200).json({ id: parseInt(req.params.typeId, 10) });
  });
});

module.exports = router;
