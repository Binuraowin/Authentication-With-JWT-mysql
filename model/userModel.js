const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("user", {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  id:{
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;