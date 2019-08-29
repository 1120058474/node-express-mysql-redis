// 获取url参数 依赖于url模块 使用前需要使用
const URL = require('url');
const express = require('express');
const router = express.Router();
const mysql = require('../common/basicConnection');
const jwt = require('jsonwebtoken');

const redis = require('../utils/redis')

router.get('/info', function(req, res, next) {
	jwt.verify(req.headers['x-token'], 'token', (err, decode)=> {
		redis.get('userInfo',(err,reply)=>{
			if(reply){
				res.json({
					data:JSON.parse(reply),
					message:'',
					code:200
				})
			}else{
				mysql.query(`SELECT * FROM user_info WHERE id="${decode.id}"`,
				function(err, rows){
					if(err) throw err
					redis.set('userInfo',JSON.stringify(rows[0]),redis.print)
					res.json({
						data:rows[0],
						message:'',
						code:200
					})
				})
			}
		})
	})
});

module.exports = router;