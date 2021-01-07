const Sequelize = require('sequelize')
const connection = require('../database/database')
const category = require('../categorias/category')

/* Definindo a criaçao da tabela no banco de dados informando o nome da tabela e dentro de um objeto
informando os atributos (tipos dos campos) e se ele pode deixar de ser preenchido ou nao pelo user */  
const article = connection.define('articles', {
       title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

category.hasMany(article) /*Relacionamento Muitos para Muitos - Informo que 1 categoria pode estar presente 
em vários artigos (hasMany = Tem muitos...) */

article.belongsTo(category) /*Relacionamento 1 para 1 - Informo que 1 artigo pertence a apenas 1 categoria
(belongsTo = Pertence há...) */

//article.sync({force: true}) 
/* Realizando a sincronizacao do model com o banco de dados. Obs: Essa sincronizacao
através desse comando será realizada sempre que o projeto for iniciado entao é interessante comentar ou excluir esse
comando assim que já tiverem sido criadas as tabelas  */

module.exports = article