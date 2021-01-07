//Middleware criado para ser utilizado nas rotas onde desejamos que apenas usuários autenticados 
//possuam acesso, ou seja se o usuário possuir uma sessao ativa ele terá o acesso concedido, caso 
//contrário ele será redirecionado 
function adminAuth(req, res, next) {
    if(req.session.user != undefined){
        next()
    }else{
        res.redirect('/admin/login')
    }
}

module.exports = adminAuth //Exportando o middleware criado