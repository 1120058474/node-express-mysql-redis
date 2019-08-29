// 获取url参数 依赖于url模块 使用前需要使用
const URL = require('url');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('../common/basicConnection');

const redis = require('../utils/redis')

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  mysql.query(`SELECT * FROM user_info WHERE userName="${username}"`,
    function(err, rows){
      if(err) throw err
      if(rows.length) {
        const { userName, passWord, name, id, avatar } = rows[0]
        if(password == passWord){
            redis.del(req.headers['x-token']);
            const token = jwt.sign(
                {
                    id: id //需要放到token的参数
                },
                'token',
                {
                    expiresIn: 2 * 60 * 60//120分钟到期时间
                }
            )
            redis.set(token,token,redis.print);
            res.json({
                data:{
                    token: token,
                },
                message:'成功！',
                code:200
            })
        }else{
            res.json({
                data:{},
                message:'用户名或密码错误！',
                code:201
            })
        }
      }else{
        res.json({
            data:{},
            message:'用户名不存在！',
            code:201
        })
      }
  })
});

router.get('/logout', function(req, res, next) {
    redis.del(req.headers['x-token']);
    redis.del('userInfo');
    res.json({
        data:{},
        message:'成功！',
        code:200
    })
});

module.exports = router;