const bancoDeDados = require('./public/data/db.json');


/*
Na primeira execução vai criar automaticamente um banco 
chamdo database.sqlite na raiz do projeto e realizar todos 
os passos do CRUD. Na segunda execução, considerando que
o banco de dados já foi criado e o id já foi criado é preciso
incrementá-lo para pegar um id existente no banco.
*/
(async () => {
    const database = require('./public/js/connect');
    const Produto = require('./public/js/produto');
    try {
        const resultado = await database.sync();
        //console.log(resultado);

        //Create
        const resultadoCreate = await Produto.create({
            nome: 'iPhone',
            preco: 5000,
            descricao: 'Um iPhone'
        })
        //console.log(resultadoCreate);

        var id = 1;

        //Retreive (all)
        const produtos = await Produto.findAll();  
        console.log('-----> Retreive (all)');
        for(var produtoDb of produtos){
            id = produtoDb.id;
            console.log('-----> ' + produtoDb.nome);
        }   
        
        //Retreive (byPk)        
        var produto = await Produto.findByPk(id);
        console.log('-----> Retreive (byPk)');
        console.log('-----> ' + produto.nome);

        //Update        
        produto.descricao = "Um outro iPhone";
        const resultadoSave = await produto.save();
        console.log('-----> Update');
        console.log('-----> ' + resultadoSave.descricao);

        //Delete opção 1
        console.log('-----> Delete opção 1');
        Produto.destroy({ where: { id: id }});
        
        //Delete opção 2
        //const produto = await Produto.findByPk(1);
        //produto.destroy();

        //Delete opção 3
        //Produto.destroy({ where: { id: 1 }});
 
        //Delete opção 4
        //const produto = await Produto.findByPk(1);
        //produto.destroy();

        console.log('-----> CRUD realizado com sucesso!');

    } catch (error) {
        console.log(error);
    }
})();







console.log("Servidor iniciado...");



module.exports = ()=>{
    return bancoDeDados;
};