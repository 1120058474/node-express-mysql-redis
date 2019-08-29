const express = require('express');
const router = express.Router();

/* GET home page. */
// 定义一个 get 请求 path 为根目录
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;