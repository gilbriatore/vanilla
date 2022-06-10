const bancoDeDados = require('./public/data/db.json');
console.log("Servidor iniciado...");



module.exports = ()=>{
    return bancoDeDados;
};