// ===============================
// UTIL: Formatar data para DD/MM/YYYY
// ===============================
function formatarDataBr(dataISO) {
    const partes = dataISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}



// ===============================
// BOTÃO QUE BAIXA A PLANILHA EM XLSX
// ===============================

document.getElementById("btnExportar").addEventListener("click", function () {
    const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];

    if (registros.length === 0) {
        alert("Não há registros para exportar.");
        return;
    }

    // Converter dados para formato de planilha
    const dados = registros.map(r => ({
        Data: r.data,
        "Cliente/Projeto": r.cliente,
        Tipo: r.tipo,
        Faixa: r.faixa,
        "Valor Unitário": r.valorUnitario,
        Alterações: r.totalAlteracoesCliente,
        "Formato Extra": r.formatoExtra,
        Observações: r.obs || ""
    }));

    // Criar worksheet e workbook
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

    // Nome do arquivo com data
    const hoje = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `registros_artes_${hoje}.xlsx`);
});




// ===============================
// CARREGAR REGISTROS DO LOCALSTORAGE
// ===============================
function carregarRegistros() {
    const registrosSalvos = JSON.parse(localStorage.getItem("registrosArtes")) || [];

    registrosSalvos.forEach(registro => {
        adicionarLinhaTabela(registro);
    });
}

// ===============================
// ADICIONAR LINHA NA TABELA
// ===============================
function adicionarLinhaTabela(registro) {
    const tabela = document.querySelector("#tabelaRegistros tbody");

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${registro.data}</td>
        <td>${registro.cliente}</td>
        <td>${registro.tipo}</td>
        <td>${registro.faixa}</td>
        <td>${registro.valorUnitario}</td> 
        <td>${registro.totalAlteracoesCliente}</td>
        <td>${registro.formatoExtra}</td>
        <td>${registro.obs}</td>
    `;

    tabela.appendChild(tr);
}


function obterUltimaObservacao(cliente, registrosSalvos) {
    for (let i = registrosSalvos.length - 1; i >= 0; i--) {
        if (registrosSalvos[i].cliente === cliente && registrosSalvos[i].obs) {
            return registrosSalvos[i].obs;
        }
    }
    return "";
}


// ===============================
// SALVAR REGISTRO
// ===============================
function salvarRegistro(registro) {
    const registrosSalvos = JSON.parse(localStorage.getItem("registrosArtes")) || [];
    registrosSalvos.push(registro);

    localStorage.setItem("registrosArtes", JSON.stringify(registrosSalvos));
}

// ===============================
// FORM SUBMIT
// ===============================


document.getElementById("registroForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const registrosSalvos = JSON.parse(localStorage.getItem("registrosArtes")) || [];

    

    // Capturar valores
    const data = document.getElementById("data").value;
    const cliente = document.getElementById("cliente").value;
    const tipo = document.getElementById("tipo").value;
    const alteracaoAtual = Number(document.getElementById("alteracao").value);

// ===============================
// SOMAR ALTERAÇÕES DO MESMO CLIENTE
// ===============================
let totalAlteracoesCliente = alteracaoAtual;

for (let i = 0; i < registrosSalvos.length; i++) {
    if (registrosSalvos[i].cliente === cliente) {
        totalAlteracoesCliente += registrosSalvos[i].alteracaoAtual || 0;
    }
}



    const formatoExtra = document.getElementById("formatoExtra").value;
    let obs = document.getElementById("obs").value.trim();

if (!obs) {
    obs = obterUltimaObservacao(cliente, registrosSalvos);
}


    // Tratamento da data
    const dataFormatada = formatarDataBr(data);

    //AQUI VÃO AS REGRAS:
    let valorUnitario;
    let faixa;
    

    const quantidade = registrosSalvos.length + 1;


            // FAIXA 1
        if (quantidade <=20 && tipo == "Estático" && totalAlteracoesCliente <= 2 ){
            faixa = 1;
            valorUnitario = 25;

        }else if(quantidade <=20 && tipo == "Carrossel" && totalAlteracoesCliente <= 2 ){
            valorUnitario = 45;
            faixa = 1;
        }else if (quantidade <=20 && tipo == "Estático" && totalAlteracoesCliente >= 3){
            faixa = 1;
            valorUnitario = 12.50;

        }else if(quantidade <=20 && tipo == "Carrossel" && totalAlteracoesCliente >= 3){
            faixa = 1;
            valorUnitario = 22.50;
        }


        // FAIXA 2
        else if (quantidade  >= 21 && quantidade <= 60 && tipo == "Estático" && totalAlteracoesCliente <= 2  ){
            faixa = 2;
            valorUnitario = 20;

        }else if (quantidade  >= 21 && quantidade <= 60 && tipo == "Carrossel" && totalAlteracoesCliente <= 2 ){
            faixa = 2;
            valorUnitario = 40;

        }else if (quantidade  >= 21 && quantidade <= 60 && tipo == "Estático" && totalAlteracoesCliente >= 3){
            faixa = 2;
            valorUnitario = 10;
            
        }else if(quantidade  >= 21 && quantidade <= 60 && tipo == "Carrossel" && totalAlteracoesCliente >= 3){
            faixa = 2;
            valorUnitario = 20;
        }


        // FAIXA 3
        else if (quantidade >=61 && tipo == "Estático" && totalAlteracoesCliente <= 2 ){
            faixa = 3;
            valorUnitario = 15;

        }else if (quantidade >=61 && tipo == "Carrossel" && totalAlteracoesCliente <= 2){
            faixa = 3;
            valorUnitario = 35;
        }else if (quantidade >=61 && tipo == "Estático" && totalAlteracoesCliente >= 3 ){
            faixa = 3;
            valorUnitario = 7.50;
        }
        else if (quantidade >=61 && tipo == "Carrossel" && totalAlteracoesCliente >= 3 ){
            faixa = 3;
            valorUnitario = 17.50;
        }

    const totalAnterior = calcularTotal(registrosSalvos);
    const total = totalAnterior + valorUnitario;

        //MESMO QUE TNEHA 20 ALTERAÇÕES AINDA VAI CONTINUAR SENDO APENAS UM REGISTRO NO LOCALSTORAGE

    // Criar objeto
    const registro = {
        data: dataFormatada,
        cliente,
        tipo,
        faixa,
        valorUnitario,
        alteracaoAtual,
        totalAlteracoesCliente,
        formatoExtra,
        obs,
  
        
    };

   function calcularTotal(registrosSalvos) {
    let total = 0;

    for (let i = 0; i < registrosSalvos.length; i++) {
        total += registrosSalvos[i].valorUnitario;
    }

    return total;
}

    // Adicionar à tabela
    adicionarLinhaTabela(registro);

    // Salvar no LocalStorage
    salvarRegistro(registro);

    // Limpar formulário
    document.getElementById("registroForm").reset();
});

// ===============================
// Quando abrir a página
// ===============================
carregarRegistros();

document.getElementById("cliente").addEventListener("blur", function () {
    const clienteDigitado = this.value.trim();
    if (!clienteDigitado) return;

    const registrosSalvos = JSON.parse(localStorage.getItem("registrosArtes")) || [];
    const ultimaObs = obterUltimaObservacao(clienteDigitado, registrosSalvos);

    if (ultimaObs) {
        document.getElementById("obs").value = ultimaObs;
    }
});

