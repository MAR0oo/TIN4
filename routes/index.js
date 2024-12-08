var express = require('express');
var router = express.Router();

router.get('/form', function(req, res, next) {
  res.render('form');
});

router.post('/submit', function(req, res, next) {
  const { field1, field2, field3 } = req.body;

  if (!field1 || !field2 || !field3) {
    return res.status(400).render('error', { message: 'Wszystkie pola są wymagane!' });
  }

  res.render('result', { message: 'Dane zostały pomyślnie przetworzone!' });
});

module.exports = router;
