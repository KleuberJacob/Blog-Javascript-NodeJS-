const express = require('express')
const router = express.Router()
const User = require('./user')
const bcrypt = require('bcryptjs') //Utilizando a biblioteca bcryptjs(hash) para criptografar os dados do usuário antes de salva-los no DB 
const adminAuth = require('../middlewares/AdminAuth')

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', { users:users })
    })
})

router.get('/admin/users/create', (req, res) => { //Rota pra criar acesso de usuarios
    res.render('admin/users/create')
})

router.post('/users/create', (req, res) => { //Rota que recebe dados de formulario para cadastro de novo usuário
    let email = req.body.email //Dados coletados do formulario
    let password = req.body.password    
   
    User.findOne({where:{email:email}}).then(user => { //Validacao junto ao DB se existe email igual já cadastrado
        if(user == undefined) { //Caso nao exista email igual no DB

            let salt = bcrypt.genSaltSync(10) //Encriptando a senha do usuário antes de salva-la no DB (hash)
            let hash = bcrypt.hashSync(password, salt)

            User.create({ 
                email: email,
                password: hash //Salvando o hash no banco
            }).then(() => {
                res.redirect('/admin/users')
            }).catch((err) => {
                res.redirect('/admin/users/create')
            })
        }else{
            res.redirect('/admin/users/create')
        }
    })     
})

router.get('/admin/login', (req, res) => { //Rota de acesso a view de login dos usuários
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => { //Rota que recebe os dados do usuário através de um formulário

    let email = req.body.email
    let password = req.body.password

    User.findOne({where:{email:email}}).then(user => { //Validando email informado pelo usuário
        if(user != undefined) { //Caso o email exista no DB

            let correctPassword = bcrypt.compareSync(password, user.password) //Realizando validacao (comparando o hash) da senha informado pelo no acesso com o hash salvo no DB

            if(correctPassword) { //Caso as hashs sejam iguais liberamos uma sessao para esse usuário
                req.session.user = {
                    id: user.id, 
                    email: user.email
                }
                //res.json(req.session.user) //Retorno da sessao visualizando os dados para teste
                res.redirect('/admin/articles') 
            }else {
                res.redirect('/admin/login')
            }

        }else{
            res.redirect('/admin/users/create')
        } 
    })
})

router.get('/logout', (req, res) => { //Rota criada para realizar logout
    req.session.user = undefined //A partir do momento que a session se tornar undefined quer dizer que o usuário nao esta logado
    res.redirect('/')
})

module.exports = router