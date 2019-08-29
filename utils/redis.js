const redis = require('redis');
const redisConfig = require('../config/redis');

const client = redis.createClient(redisConfig.RDS_PORT, redisConfig.RDS_HOST, redisConfig.RDS_OPTS);

function del(key,callback){
    check(key,function(err, reply){
        if(reply == 1){
            client.del(key, function(err, reply) {
                callback && callback(err, reply);
                console.log(key + '------已删除');
            });
        }
    })
} 

function set(key,data,print){
    client.set(key,data,print);
}

function get(key,callback){
    client.get(key, function(err, reply) {
        callback && callback(err, reply)
    })
}

function check(key,callback){
    if(key){
        client.exists(key, function(err, reply) {
            callback(err, reply)
        })
    }
}

module.exports = {
    del:del,
    set:set,
    get:get,
    check:check
}