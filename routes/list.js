let express = require('express');
let mysql = require('../common/basicConnection');

let qibu_task = {
    index: '',
    value: '',
    list: `SELECT * from qibu_task;`, //列表查询
    insert(args) {
        qibu_task.index = '';
        qibu_task.value = '';
        args = filter(['id', 'task', 'name', 'created_at'], args)
        for (let key in args) {
            qibu_task.index = `${qibu_task.index}${key},`
            let re = /^[0-9]+.?[0-9]*/;
            if (re.test(args[key])) {
                qibu_task.value = `${qibu_task.value}${args[key]},`
            } else {
                qibu_task.value = `${qibu_task.value}'${args[key]}',`
            }
        }
        qibu_task.index = qibu_task.index.substr(0, qibu_task.index.length - 1);
        qibu_task.value = qibu_task.value.substr(0, qibu_task.value.length - 1);

        return `INSERT INTO qibu_task (${qibu_task.index}) VALUES(${qibu_task.value})`;
    }, //按需增加
    select(index, value) {
        return `SELECT * from qibu_task where ${index}=${value};` //按需查询
    },
    delete(index, value) {
        return `DELETE from qibu_task where ${index}=${value};` //按需删除
    },
    update(index, args) { //提交修改
        if (index in args) {
            qibu_task.value = '';
            args = filter(['id', 'task', 'name', 'created_at'], args)
            for (let key in args) {
                let re = /^[0-9]+.?[0-9]*/;
                if (re.test(args[key])) {
                    qibu_task.value = `${qibu_task.value}${key}=${args[key]},`
                } else {
                    qibu_task.value = `${qibu_task.value}${key}='${args[key]}',`
                }
            }
            qibu_task.value = qibu_task.value.substr(0, qibu_task.value.length - 1)
            return `UPDATE qibu_task SET ${qibu_task.value} WHERE ${index}=${args[index]};`
        }
    },
};
//参数过滤
function filter(arguments, obj) {
    let newObj = {}
    arguments.forEach(every => {
        if (every in obj) {
            newObj[every] = obj[every]
        }
    });
    return newObj;
};
module.exports = qibu_task;