const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('root');
});

router.post('/', (req, res, next) => {
  res.send('add');
});

router.get('/:todoId', (req, res, next) => {
  res.send(req.params.todoId);
});

router.put('/:todoId', (req, res, next) => {
  res.send(req.params.todoId);
});

router.delete('/:todoId', (req, res, next) => {
  res.send('delete: ', req.params);
});

module.exports = router;
