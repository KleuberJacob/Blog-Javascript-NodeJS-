const express = require('express')
const router = express.Router() /* Utilizando o Router para criar rotas de acesso para que possam ser 
utilizadas em outros modulos (index.js) */
const Category = require('./category') // Acessando o banco de dados (tabela)
const slugify = require('slugify') // Chamando biblioteca slugify para ser utilizada
const adminAuth = require('../middlewares/AdminAuth')

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => { // Rota que recebe os dados informado no formulário de criacao de categoria
    let title = req.body.title // Armazenando o dado recebido em uma variável
    if(title != undefined) { // Realizando validaçao do dado recebido
        Category.create({ // Salvando o dado recebido na tabela do banco de dados
            title: title,
            slug: slugify(title) // Utilizando slugify sob o title recebido
        }).then(() => {
            res.redirect('/admin/categories') // Após salvar o dado no DB redirecionar para raiz(página principal)
        })
    } else { // Caso ocorra algum erro ou o dado nao seja validado redireciona para página de cadastro de nova categoria
        res.redirect('admin/categories/new')
    }
})

router.get('/admin/categories', adminAuth, (req, res) => { // Rota para servir os dados armazenados no DB
    Category.findAll() // Procurando por todos os dados armazenados 
        .then((categories) => { // Retornando os dados renderizados junto há uma página html
            res.render('admin/categories/index', { categories: categories })
    })    
})

router.post('/categories/delete', (req, res) => { // Rota criada para exclusão de uma categoria
    let id = req.body.id // Armazenando na variável id o parametro id recebido através do formulário
    if(id != undefined) { // Realizando validacao no dado recebido
        if(!isNaN(id)) {// Realizando uma segunda validacao no dado recebido
            Category.destroy({ // Em tudo OK acessamos a tabela e excluímos o dado where=onde o ID informado se encontra
                where: {
                    id: id
                }
            }).then(() => { // Após realizada exclusao redirecionamos 
                res.redirect('/admin/categories')
            })
        } else { // Caso o ID informado nao seja um valor numérico
            res.redirect('/admin/categories')
        }
    } else { // Caso o ID informado seja nulo (nao exista)
        res.redirect('/admin/categories')
    }
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => { // Rota criada para edicao de uma categoria que recebe um id passado como parametro na url
    let id = req.params.id

    if(isNaN(id)) { // Inserindo validacao para que o parametro de ID passado na URL possua somente numeros
        res.redirect('/admin/categories')
    }

    Category.findByPk(id) // Realizando a busca no DB através do ID=Primary Key
        .then(categoria => {
            if(categoria != undefined) { // Caso o id passado seja encontrado e nao seja undefined
                res.render('admin/categories/edit', { categoria: categoria }) // Será renderizada uma pág html
            } else {
                res.redirect('/admin/categories') // Caso contrário será redirecionada para outra pág html 
            }
        }).catch(error => { // Caso ocorra algum erro será efetuado um redirecionamento
            res.redirect('/admin/categories')
        })
    })

router.post('/categories/update', (req, res) => { // Rota criada para atualizar categoria
    let id = req.body.id
    let title = req.body.title

    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})
    
module.exports = router //Exportando a rota criada para que possa ser utilizada por outro módulo presente no projeto