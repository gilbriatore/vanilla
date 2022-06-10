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

function enviar(produto, url, method, json){
    fetch(url, {
        method: method,
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

        if (produto != null){
            txtNome.value = produto.nome;
            txtDesc.value = produto.desc;
        }

        var btnSalvar = document.getElementById('btnSalvar');
        btnSalvar.onclick = ()=>{

            var txtNome = document.getElementById('nome');
            var txtDesc = document.getElementById('desc');
            var nomeForm = txtNome.value;
            var descForm = txtDesc.value;

            var json = {
                "nome": nomeForm,
                "desc": descForm
            }

            var url = 'http://localhost:3000/produtos'

            if (produto != null){
              enviar(produto, url + '/' + produto.id, 'PUT', json);                
            } else {
               enviar(produto, url, 'POST', json);                
            }
        }
    });
}

function configurarForm(produto){
    carregarHtml('html/form.html', main, produto);
}

var listaDeProdutos; 

function gerarTabela(url){
    main.innerHTML = '';

    var btnIncluir = document.createElement('button');
    btnIncluir.innerText = "Incluir";
    btnIncluir.onclick = ()=> {
        configurarForm();
    }

    main.appendChild(btnIncluir);

    fetch(url)
    .then((resposta)=> {
        return resposta.json();
    })
    .then((produtos)=>{
        listaDeProdutos = produtos;

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

            //Link editar
            var linkEditar = document.createElement('a');
            linkEditar.href = '#' + produto.id;
            linkEditar.setAttribute("id", produto.id);
            var txt = document.createTextNode('Editar');
            linkEditar.appendChild(txt);            
            linkEditar.onclick = (event)=> {
                var id = event.target.id;               
                var produto = listaDeProdutos.find(produto => produto.id == id);      
                configurarForm(produto);
            }
            td.appendChild(linkEditar);

            //Link excluir
            var linkExcluir = document.createElement('a');
            linkExcluir.href = '#' + produto.id;
            linkExcluir.setAttribute("id", produto.id);
            var txt = document.createTextNode('Excluir');            
            linkExcluir.appendChild(txt);            
            linkExcluir.onclick = (event)=> {
                if (confirm('Tem certeza que deseja excluir o produto?')) {
                    fetch('http://localhost:3000/produtos/' + event.target.id, {
                        method: "DELETE"                        
                    })
                    .then(()=> {
                        gerarTabela('http://localhost:3000/produtos');
                    });
                }
            }
            td.appendChild(linkExcluir);

            tr.appendChild(td);            
            tbody.appendChild(tr);
            
        }

        table.appendChild(tbody);

        
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
    main.innerHTML = '';
    carregarImagem('imgs/carne1.jpg');
}

btnArquivo.onclick = ()=>{     
    main.innerHTML = '';      
    gerarLista('data/arquivo.json');
}

btnAPI.onclick = ()=>{     
    main.innerHTML = '';      
    gerarLista('http://localhost:3000/produtos');
}

btnProdutos.onclick = ()=>{
    main.innerHTML = '';
    gerarTabela('http://localhost:3000/produtos');
}

