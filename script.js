	$.ajax({

            'url': "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
            'type': "GET",
            'success': function(listaUf){     
                      var option = '<option>Selecione o Estado</option>';
                        $.each(listaUf, function(i, obj){
                            option += '<option value="'+obj.id+'">'+obj.sigla+'</option>';
                        })      
                    
                    $("#estado").html(option).show(); 
              }
        });



          $('#estado').change(function(e){
              var estado = $('#estado').val();
              $.ajax({

                'url': "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"+estado+"/municipios",
                'type': "GET",
                'success': function(listaCidades){      
                          var option = '<option>Selecione a Cidade</option>';
                            $.each(listaCidades, function(i, obj){
                                option += '<option>'+obj.nome+'</option>';
                            })      
                        
                        $("#cidade").html(option).show(); 
                  }
            })
          });


        function listaprofissoes1(listaprofissoes){     
                var option = '<option>Selecione a profissao</option>';
                $.each(listaprofissoes, function(i, obj){
                    option += '<option value="'+obj.id+'">'+obj.nome+'</option>';
                })      
                            
                $("#funcionarioProfissao").html(option).show(); 
            }

 function abrirAba(menus) {
          var i;
          var x = document.getElementsByClassName("aba");
          for (i = 0; i < x.length; i++) {
             x[i].style.display = "none";  
          }
          document.getElementById(menus).style.display = "block";  
      }

/*=================================================================================================================================================*/

var listaFuncionarios = [];

function salvarFuncionario(){
    var funcionario = {};

    funcionario.nome = $("#nomefuncionario").val();
    funcionario.profissao = $("#funcionarioProfissao option:selected").val();
    funcionario.salario = $("#salario").val();
    funcionario.estado = $("#estado option:selected").text();
    funcionario.cidade = $("#cidade option:selected").val();



    let id = $("#id").val();

    // não tenho código = criar novo
    if(id == undefined || id == ''){
        funcionario.id = new Date().getTime();
        listaFuncionarios.push(funcionario);
    } else { // se tenho id, estou editando
        let idNumber = parseInt(id);
        let funcionarioExistente = findFuncionarioById(idNumber);
        
        if(funcionarioExistente){
            funcionarioExistente.nome = funcionario.nome;
            funcionarioExistente.profissao = funcionario.profissao;
            funcionarioExistente.salario = funcionario.salario;
            funcionarioExistente.estado = funcionario.estado;
            funcionarioExistente.cidade = funcionario.cidade;
        }
    }

    gravaNoLocalStorage();
    renderizaFuncionario();
    zerarInputs();

    return false;
}

var listaprofissoes = [];

function salvarprofissao(){
    var profissao = {};

    profissao.nome = $("#nomeProfissao").val();

    let id = $("#id").val();

    // não tenho código = criar novo
    if(id == undefined || id == ''){
        profissao.id = new Date().getTime();
        listaprofissoes.push(profissao);
    } else { // se tenho id, estou editando
        let idNumber = parseInt(id);
        let profissaoExistente = findprofissaoById(idNumber);
        
        if(profissaoExistente){
            profissaoExistente.nome = profissao.nome;
        }
    }

    gravaProfissaoNoLocalStorage();
    zerarInputsProfissao();
    console.log(listaprofissoes);
    listaprofissoes1(listaprofissoes);
    renderizaProfissao();
    return false;
}

function renderizaFuncionario(){
    // busco o tbody com o id
    const tbody = $("#corpo-tabela");


    // zerando o conteúdo da tabela
    tbody.html('');


    for(let i=0; i<listaFuncionarios.length; i++){
        // Busco a pessoa da lista
        const funcionario = listaFuncionarios[i];

        // cria um elemento html do tipo tr
        // table row - linha da tabela
        let tr = $('<tr>');

        // cria um elemento html do tipo td
        // table data - dado da tabela
        // popular os td com o valor a ser mostrado
        let tdNome = $('<td>').text(funcionario.nome);
        let tdProfissao = $('<td>').text(funcionario.profissao);
        let tdSalario = $('<td>').text(funcionario.salario);
        let tdEstado = $('<td>').text(funcionario.estado);
        let tdCidade = $('<td>').text(funcionario.cidade);
        let tdOpcoes = $('<td>');

        let btnEditar = $('<button>').text('Editar');
        let btnExcluir = $('<button>').text('Excluir');
        
        // associa o click a uma function
        btnEditar.click(function () { 
            editar(funcionario.id); 
        });

        // associa o click a uma function
        const fn_exc = function () { 
            excluir(funcionario.id); 
        };
        btnExcluir.click(fn_exc);
        
        tdOpcoes.append(btnEditar).append(btnExcluir);

        // adiciono os td dentro do tr
        // na order a ser exibida
        tr.append(tdNome)
            .append(tdProfissao)
            .append(tdSalario)
            .append(tdEstado)
            .append(tdCidade)
            .append(tdOpcoes);

        // adiciona o tr no tbody
        tbody.append(tr);
    }
}

function renderizaProfissao(){
    // busco o tbody com o id
    const tbody = $("#corpo-tabela-profissoes");


    // zerando o conteúdo da tabela
    tbody.html('');


    for(let i=0; i<listaprofissoes.length; i++){
        // Busco a pessoa da lista
        const profissao = listaprofissoes[i];

        // cria um elemento html do tipo tr
        // table row - linha da tabela
        let tr = $('<tr>');

        // cria um elemento html do tipo td
        // table data - dado da tabela
        // popular os td com o valor a ser mostrado
        let tdNome = $('<td>').text(profissao.nome);
        let tdOpcoes = $('<td>');

        let btnEditar = $('<button>').text('Editar');
        let btnExcluir = $('<button>').text('Excluir');
        
        // associa o click a uma function
        btnEditar.click(function () { 
            editarprofissao(profissao.id); 
        });

        // associa o click a uma function
        const fn_exc = function () { 
            excluirprofissao(profissao.id); 
        };
        btnExcluir.click(fn_exc);
        
        tdOpcoes.append(btnEditar).append(btnExcluir);

        // adiciono os td dentro do tr
        // na order a ser exibida
        tr.append(tdNome)
            .append(tdOpcoes);

        // adiciona o tr no tbody
        tbody.append(tr);
    }
}

function editar(id){
   let funcionario = findFuncionarioById(id);

    if(funcionario){
        $("#nomefuncionario").val(funcionario.nome);
        $("#funcionarioProfissao").val(funcionario.profissao);
        $("#salario").val(funcionario.salario);
        $("#estado").val(funcionario.estado);
        $("#cidade").val(funcionario.cidade);
        $("#id").val(funcionario.id);
    } else {
        alert('Não foi possível encontrar a tarefa');
    }
}

function editarprofissao(id){
   let profissao = findProfissaoById(id);

    if(profissao){
        $("#nomeProfissao").val(profissao.nome);
        $("#id").val(profissao.id);
    } else {
        alert('Não foi possível encontrar a tarefa');
    }
}


function excluir(id){
    listaFuncionarios = listaFuncionarios
        .filter(function(value){
            return value.id != id;
        });

    gravaNoLocalStorage();
    renderizaFuncionario();
}

function excluirprofissao(id){
    listaprofissoes = listaprofissoes
        .filter(function(value){
            return value.id != id;
        });

    gravaProfissaoNoLocalStorage();
    renderizaProfissao();
}

function findFuncionarioById(id){
    let funcionarios = listaFuncionarios
        .filter(function(value){
            return value.id == id;
        });
    
    if(funcionarios.length == 0){
        return undefined;
    }else{
        return funcionarios[0];
    }
}

function findProfissaoById(id){
    let profissao = listaprofissoes
        .filter(function(value){
            return value.id == id;
        });
    
    if(profissao.length == 0){
        return undefined;
    }else{
        return profissao[0];
    }
}

function zerarInputs(){
    $("#formularioFuncionarios input select").val('');
}

function zerarInputsProfissao(){
    $("#formularioProfissao input").val('');
}

function gravaNoLocalStorage(){
    // convertendo a lista em string no formato JSON
    const listaEmJSON = JSON.stringify(listaFuncionarios);

    // gravando no localStorage
    localStorage.setItem("lista", listaEmJSON);
}

function gravaProfissaoNoLocalStorage(){
    // convertendo a lista em string no formato JSON
    const listaEmJSON = JSON.stringify(listaprofissoes);

    // gravando no localStorage
    localStorage.setItem("listaprofissao", listaEmJSON);
}

function buscaDoLocalStorage(){
    // busca do local storage
    const listaStorage = localStorage.getItem("lista");

    // converte para lista e atribui
    listaFuncionarios = JSON.parse(listaStorage) || [];
}

function buscaProfissaoDoLocalStorage(){
    // busca do local storage
    const listaStorage = localStorage.getItem("listaprofissao");

    // converte para lista e atribui
    listaprofissoes = JSON.parse(listaStorage) || [];
}

    // o que se deseja executar
    buscaDoLocalStorage();
    buscaProfissaoDoLocalStorage();
    listaprofissoes1(listaprofissoes);
    renderizaFuncionario();
    renderizaProfissao();

    $("#formularioFuncionarios").on("submit", function (evt){
            salvarFuncionario();
            // corta a linha de execucao
            evt.stopPropagation(); 

            // previne o comportamento padrão
            evt.preventDefault();
        });

    $("#formularioProfissao").on("submit", function (evt){
            salvarprofissao();
            // corta a linha de execucao
            evt.stopPropagation(); 

            // previne o comportamento padrão
            evt.preventDefault();
        });
    
    // busco todos os inputs
    $('input, select').each(function(index, element){
        element.oninvalid = function(){
            const msg = $(this).data('data-custom-message');

            if(msg){
                // remove mensagens de erro antigas
                this.setCustomValidity("");

                // executa novamente a validação
                if (!this.validity.valid) {
                    // se inválido, coloca mensagem de erro customizada
                    this.setCustomValidity(msg);
                }
            }
        }
    });