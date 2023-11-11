'use strict'

const Sequelize = require('sequelize')
let sequelize = null

const dialectOptions = {
  postgres: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

module.exports = function connect () {
  console.log(process.env.DIALECT_DB)
  try {
    if (!sequelize) {
      sequelize = new Sequelize(
        process.env.NAME_DB, //nombre Base de datos process.env.NAMEDB
        process.env.USER_DB, //nombre usuario base de datos process.env.USERDB
        process.env.PASS_DB, // clave de base de datos, process.env.PASSDB
        {
          host: process.env.HOST_DB,
          logging: true,
          port: process.env.PORT_DB,
          dialect: process.env.DIALECT_DB,
          dialectOptions: dialectOptions[process.env.DIALECT_DB] || {}
        }
      )
    }
    return sequelize
  } catch (error) {
    console.log(error, '/**** Error de conexión con base de datos, algunos datos erroneos o el .env no existe.')
  }
}