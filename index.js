//Importando as bibliotecas
const express = require('express') // Lib responsável por realizar requisicoes HTTP (GET, POST, PUT, DELETE)
const app = express() // Armazenando a biblioteca dentro de uma variável (app) para que seja utilizada
const bodyParser = require('body-parser') // Converte os dados do body da requisicao para vários formatos
const connection = require('./database/database') // Utilizando módulo criado para conectar ao banco de dados
const session = require('express-session') //Biblioteca para gerenciar sessoes de usuarios no express


// Chamando rotas criadas utilizando Routes fora do arquivo principal (index.js)
const categoriesController = require('./categorias/categoriesController') 
const articlesController = require('./artigos/articlesController')
const usersController = require('./user/usersController')

// Importando os arquivos dos Models criados para o arquivo principal (index.js)
const Category = require('./categorias/category')
const Article = require('./artigos/article')
const article = require('./artigos/article')
const router = require('./categorias/categoriesController')

// Setando a View Engine a ser utiliziada
app.set('view engine', 'ejs') /* Engine de visualização, com ele transportamos dados do back-end para o 
front-end */

// Sessao de Usuario
app.use(session({ //Inicializando sessao, passando uma chave(secret) e o periodo em que os dados ficarao armazenados no cookie do navegador em milisegundos
    secret: "qualquercoisa", cookie: { maxAge: 30000 }
}))

/*Realizando teste de como funciona a sessao
app.get('/session', (req, res) => {
    req.session.treinamento = "Formacao NodeJS"
    req.session.ano = 2020
    req.session.email = "kleuber.18@hotmail.com"
    req.session.user = {
        username: "kleuber jacob",
        email: "kleuber.18@hotmail.com",
        id: 10
    }
    res.send('Sessao Gerada com Sucesso!')
})

app.get('/leitura', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
}) */

// Informando localizacao dos arquivos estaticos
app.use(express.static('public')) /* Informamos que todos nossos arquivos estáticos (CSS, JS) estarao na
pasta padrao onde o express procura de forma automática (public) */


app.use(bodyParser.urlencoded({ extended: false})) // Utilizando o bodyParser
app.use(bodyParser.json())  // Solicitando que o bodyParser receba os dados enviado no formato JSON

//Acesso ao banco de dados
connection.authenticate() // Solicitando acesso a DB que retorna uma promisse
    .then(() => {
        console.log('Success Connection Database')
    }).catch (() => {
        console.log('Error Connection Database')
    })


app.get('/', (req, res) => { 
    Article.findAll({
        order: [ //Realizando a busca dos artigos no DB retornando-os ordenados para que sejam utilizados no front
            ['id', 'DESC'],
        ], 
        limit: 4        
    }).then(articles => {
        Category.findAll()
            .then(categories => {
                res.render('index', { articles: articles, categories: categories })
        }) 
    })    
})

app.get('/:slug', (req, res) => { 
    let slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll()
                .then(categories => {
                    res.render('article', { article: article, categories: categories })
            })            
        }else {
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
        let slug = req.params.slug
        Category.findOne({
            where: {
                slug: slug
            }, include: [{ model: Article }]
        }).then(category => {
            if(category != undefined) {
                Category.findAll().then(categories => {
                    res.render('index', { articles: category.articles, categories: categories })
                })
            }else {
                res.redirect('/')
            }
        }).catch(error => {
            res.redirect('/')
        })
})


// Organizando as rotas
app.use('/', categoriesController) // Utilizando as rotas criadas através do Routes do Express
app.use('/', articlesController)
app.use('/', usersController)

app.listen(3000, () => {
    console.log('Servidor Operando!')
})