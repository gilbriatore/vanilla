var main = document.getElementsByTagName('main')[0];
var btnArquivo = document.getElementById('btnArquivo');
var btnAPI = document.getElementById('btnAPI');
var btnImagem = document.getElementById('btnImagem');
var btnProdutos = document.getElementById('btnProdutos');

function criarLista(produtos){
    const lista = document.createElement('ul');
    for (const produto of produtos) {
        const item = document.createElement('li');
        item.innerText = produto.nome;   
        lista.appendChild(item);                                     
    }
    main.appendChild(lista);
}

function gerarLista(url){
    fetch(url)
    .then((resposta)=> {
        return resposta.json();
    })
    .then((json)=>{
        criarLista(json);
    })
}

function carregarHtml(url, elemento, produto){
    fetch(url)
    .then((resposta)=> {
        return resposta.text();
    })
    .then((html)=>{
        elemento.innerHTML = html;
    })
    .then(()=>{
        var txtNome = document.getElementById('nome');
        var txtDesc = document.getElementById('desc');
        txtNome.value = produto.nome;
        txtDesc.value = produto.desc;

        var btnSalvar = document.getElementById('btnSalvar');
        btnSalvar.onclick = ()=>{

            var txtNome = document.getElementById('nome');
            var txtDesc = document.getElementById('desc');
            var nomeAlterado = txtNome.value;
            var descAlterado = txtDesc.value;

            var json = {
                "nome": nomeAlterado,
                "desc": descAlterado
            }

            fetch('http://localhost:3000/produtos/' + produto.id, {
                method: "PUT",
                body: JSON.stringify(json),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(()=> {
                gerarTabela('http://localhost:3000/produtos');
            });
           
        }
    });
}

function alterarProduto(produto){
    carregarHtml('html/form.html', main, produto);
}

function gerarTabela(url){
    fetch(url)
    .then((resposta)=> {
        return resposta.json();
    })
    .then((produtos)=>{
        //Código de geração da tabela
        var table = document.createElement('table');
        var tbody = document.createElement('tbody');
        
        var qtdeLinhas = produtos.length;

        for(var i = 0; i < qtdeLinhas; i++){
            var produto = produtos[i];

            //Linha
            var tr = document.createElement('tr');

            //1a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(produto.id);            
            td.appendChild(txt);
            tr.appendChild(td);

            //2a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(produto.nome);            
            td.appendChild(txt);
            tr.appendChild(td);

            //3a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(produto.desc);            
            td.appendChild(txt);
            tr.appendChild(td);

            //4a coluna
            var td = document.createElement('td');
            var linkEditar = document.createElement('a');
            var txt = document.createTextNode('Editar');
            linkEditar.appendChild(txt);
            linkEditar.href = '#';
            linkEditar.onclick = ()=> {
                alterarProduto(produto);
            }

            td.appendChild(linkEditar);
            tr.appendChild(td);
            
            tbody.appendChild(tr);
            
        }

        table.appendChild(tbody);

        main.innerHTML = '';
        main.appendChild(table);        

    })
}


function carregarImagem(url){
    fetch(url)
    .then((resposta)=> {
        return resposta.blob();
    })
    .then((imgCarregada)=>{
        var imgElemento = document.createElement('img');
        imgElemento.src = URL.createObjectURL(imgCarregada);
        main.appendChild(imgElemento);
    })
}

btnImagem.onclick = ()=>{
    carregarImagem('imgs/carne1.jpg');
}

btnArquivo.onclick = ()=>{           
    gerarLista('data/arquivo.json');
}

btnAPI.onclick = ()=>{           
    gerarLista('http://localhost:3000/produtos');
}

btnProdutos.onclick = ()=>{
    gerarTabela('http://localhost:3000/produtos');
}

