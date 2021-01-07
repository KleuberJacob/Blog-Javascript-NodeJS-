const express = require('express')
const router = express.Router()
const Category = require('../categorias/category')
const Article = require('../artigos/article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/AdminAuth') //Importando o middleware criado


router.get('/admin/articles', adminAuth, (req, res) => { // Rota criada para servir todos os artigos salvos no DB
    Article.findAll({ // Comando para buscar todos os artigos salvos
        include: [{ model: Category }] // Inclusao da categoria devido ao relacionamento das tabelas artigos e categoria
    }).then((articles) => {
            res.render('admin/articles/index', { articles: articles }) // Após receber os artigos renderizar a pag. 
        })  // e repassar os dados vindos do banco que foram armazenados na variável articles    
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll()
        .then(categories => {
            res.render('admin/articles/new', { categories: categories })
    })    
})

router.post('/articles/save', (req, res) => { // Rota responsável por receber os dados do form e salva-los no DB
    let title = req.body.title
    let body = req.body.body
    let categorie = req.body.categorie
    
    Article.create({ // Acessando a tabela criada no DB e armazenando os dados recebidos nos respectivos campos 
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categorie // Chave estrangeira FK
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete', (req, res) => { // Rota criada para exclusão de uma categoria
    let id = req.body.id // Armazenando na variável id o parametro id recebido através do formulário
    if(id != undefined) { // Realizando validacao no dado recebido
        if(!isNaN(id)) {// Realizando uma segunda validacao no dado recebido
            Article.destroy({ // Em tudo OK acessamos a tabela e excluímos o dado where=onde o ID informado se encontra
                where: {
                    id: id
                }
            }).then(() => { // Após realizada exclusao redirecionamos 
                res.redirect('/admin/articles')
            })
        } else { // Caso o ID informado nao seja um valor numérico
            res.redirect('/admin/articles')
        }
    } else { // Caso o ID informado seja nulo (nao exista)
        res.redirect('/admin/articles')
    }
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => { //Rota criada para ediçao de artigos (pegar o artigo pelo id) pesquisando por ele no DB
    let id = req.params.id
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { article: article, categories: categories })
            })
        }else{
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

router.post('/articles/update', (req, res) => { //Rota responsável pela atualizacao de artigo do tipo post, onde recebemos os dados de um formulário, casamos com as colunas do DB e salvamos 
    let id = req.body.id
    let title = req.body.titulo
    let body = req.body.body
    let categorie = req.body.categorie

    Article.update({title: title, body: body, categoryId: categorie, slug:slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(err => {
        res.redirect('/')
    })        
})

router.get("/articles/page/:num", (req, res) => { //Implementando lógica de paginação
    let page = req.params.num //Parametro passado na url
    let offset = 0 //Setando variável em 0

    if(isNaN(page) || page == 1){ //Se o valor passado no parametro (page) nao for um número ou valor digitado for igual a 1
        offset = 0
    }else{ //Caso contrário
        offset = (parseInt(page) - 1) * 4 //Pego o valor recebido e multiplico pela quantidade de itens que desejo em cada página
    }

    Article.findAndCountAll({ //Método que retorna todos os itens armazenados na tabela selecionada além da quantidade de itens no total
        limit: 4, //No corpo do objeto informo que desejo no máximo 4 itens retornados por vez
        offset: offset
    }).then(articles => {

        let next //Criada variável next (próxima página)
        if(offset + 4 >= articles.count){ //Lógica para visualizar se temos ou nao uma próxima página
            next = false
        }else{
            next = true
        }

        let result = { //Armazenando na variável result o retorno de next além dos artigos. Quando for utilizar na view lembrar de que os artigos serao enviados dentro de result
            page: parseInt(page), //A variável page é recebida como uma string por isso temos de transforma-la em número inteiro
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => { //Buscando no DB as categorias 
            res.render('admin/articles/page', { result: result, categories: categories }) //Renderizando uma view(page), além de enviar os dados armazenados em result e categories
        })

        //res.json(result) //A resposta sendo enviada ao browser no formato json para testar a funcionalidade
    })
})

module.exports = router