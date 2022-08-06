// 引入 sequelize 套件
const { Sequelize } = require('sequelize');

// 透過 new 建立 Sequelize 這個 class，而 sequelize 就是物件 instance
const sequelize = new Sequelize('database', 'root', 'Abb22522313', {
  host: 'localhost',
  dialect: 'mysql'
});

console.log(sequelize.authenticate())
