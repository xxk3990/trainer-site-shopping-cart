'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const process = require("process")
const environment = process.env.NODE_ENV;
const config = require(`${__dirname}/../config/config.js`)[environment];
const db = {};
const bcrypt = require("bcrypt");
const {
  productModel
} = require('./product');
const {
  orderModel
} = require("./order")
const {
  orderItemModel
} = require("./order-item");
const {
  userModel
} = require("./user")
const rdsCa = fs.readFileSync('../server/us-east-2-bundle.pem');

const connectionOptions = {
  host: "",
  port: 5432,
  logging: console.log,
  dialect: 'postgres',
  language: 'en',
  pool: {
    max: 40,
    acquire: 6000,
    idle: 6000,
    size: 20
  },
  dialectOptions: {
    connectTimeout: 60000,
  }
}

if(environment === 'development') {
  //change host based on environment
  connectionOptions.host = ""; //clear existing value
  connectionOptions.host = "localhost" //change to localhost
} else if(environment === 'production') {
  connectionOptions.host = ""; //clear existing value
  connectionOptions.host = process.env.RDS_HOSTNAME; //change host to RDS URL
  connectionOptions.dialectOptions = {}; //clear existing object
  connectionOptions.dialectOptions = { //change dialect options to require SSL
    connectTimeout: 60000,
    ssl: {
      rejectUnauthorized: true,
      ca: [rdsCa]
    }

  }
}
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: connectionOptions.host,
  port: connectionOptions.port,
  logging: connectionOptions.logging,
  dialect: connectionOptions.dialect,
  language: connectionOptions.language,
  pool: connectionOptions.pool,
  dialectOptions: connectionOptions.dialectOptions
})


const models = {
  Product: productModel(sequelize, Sequelize.DataTypes),
  Order: orderModel(sequelize, Sequelize.DataTypes),
  Order_Item: orderItemModel(sequelize, Sequelize.DataTypes),
  User: userModel(sequelize, Sequelize.DataTypes),
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(() => {
    for (const m of Object.values(models)) {
      db[m.name] = m;
    }

  });
models.Order.hasMany(models.Order_Item, {
  as: "items_in_order",
  foreignKey: "order_uuid"
})

models.Order.belongsTo(models.User, {
  as: "order_user",
  foreignKey: "user_uuid"
})



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;