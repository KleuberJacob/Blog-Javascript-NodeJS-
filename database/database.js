const Sequelize = require('sequelize') // Armazenando a biblioteca de acesso a banco de dados em uma variavel

/* Armazenado em uma variável utilizando a lib todas informacoes que serao utilizadas para acessar o banco 
de dados nesse caso o MySQL (nome, user, senha) e onde o banco está armazenado
*/
const connection = new Sequelize('blognodejs', 'kleuber', 'Kleuber201317', {
    host: 'mysql742.umbler.com',
    dialect: 'mysql',
    timezone: '-03:00' // Configurando o DB para utilizar o meu timezone, pois por padrao ele utiliza um timezone universal diferente do BR
})

// Exportando o módulo criado para que possa ser utilizado dentro de outro módulo da aplicacao
module.exports = connection