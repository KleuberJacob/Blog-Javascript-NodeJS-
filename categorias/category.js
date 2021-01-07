const Sequelize = require('sequelize')
const connection = require('../database/database')

const category = connection.define('categories', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug: { // O slug é uma versao sem espaços de um texto tipo (Quero suco) slug = quero-suco
        type: Sequelize.STRING,
        allowNull: false
    }
})


//category.sync({force: true})

module.exports = category