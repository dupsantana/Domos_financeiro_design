// ===============================
// UTIL: Formatar data para DD/MM/YYYY
// ===============================
function formatarDataBr(dataISO) {
    const partes = dataISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ===============================
// LÓGICA DE SEPARAÇÃO DO NOME DO CLIENTE COM TIPO ESTÁTICO OU CARROSSEL
// ===============================

function buscarObservacoes(cliente, tipo) {
    const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];

    for (let i = registros.length - 1; i >= 0; i--) {
        if (
            registros[i].cliente === cliente &&
            registros[i].tipo === tipo &&
            registros[i].obs
        ) {
            return registros[i].obs;
        }
    }
    return "";
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

    // Faixa GLOBAL (vale para todos)
    const faixaAtual = calcularFaixa(registros.length);

    // Montar dados recalculados
const dados = registros.map(registro => {
    const totalAlteracoes = calcularTotalAlteracoes(
        registro.cliente,
        registro.tipo
    );

    const valor = calcularValor(
        { ...registro, alteracoes: totalAlteracoes },
        faixaAtual
    );

    return {
        Data: registro.data,
        "Cliente/Projeto": registro.cliente,
        Tipo: registro.tipo,
        Faixa: faixaAtual,
        Valor: Number(valor.toFixed(2)),
        Alterações: totalAlteracoes,
        "Formato Extra": registro.formatoExtra,
        Observações: registro.obs || ""
    };
});

    // Criar planilha
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

    const hoje = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `registros_artes_${hoje}.xlsx`);
});





// ===============================
// CARREGAR REGISTROS DO LOCALSTORAGE
// ===============================
function carregarRegistros() {
    const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
    const tbody = document.querySelector("#tabelaRegistros tbody");
    tbody.innerHTML = "";

    registros.forEach((registro, index) => {
        adicionarLinhaTabela(registro, index, registros.length);
    });
}


// ===============================
// ADICIONAR LINHA NA TABELA
// ===============================
function adicionarLinhaTabela(registro, indice, totalRegistros) {
    const tabela = document.querySelector("#tabelaRegistros tbody");
    const tr = document.createElement("tr");

    const faixaAtual = calcularFaixa(totalRegistros);

    const totalAlteracoes = calcularTotalAlteracoes(
        registro.cliente,
        registro.tipo
    );

    const valor = calcularValor(
        { ...registro, alteracoes: totalAlteracoes },
        faixaAtual
    );

    tr.innerHTML = `
        <td>${registro.data}</td>
        <td>${registro.cliente}</td>
        <td>${registro.tipo}</td>
        <td>${faixaAtual}</td>
        <td>R$ ${valor.toFixed(2)}</td>
        <td>${totalAlteracoes}</td>
        <td>${registro.formatoExtra}</td>
        <td>${registro.obs}</td>
    `;

    tabela.appendChild(tr);
}


// REGRA DO PRIMEIRO PROJETO/CLIENTE NÃO PODE TER ALTERAÇÃO
function isPrimeiroRegistro(cliente, tipo) {
    const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
    return !registros.some(r => r.cliente === cliente && r.tipo === tipo);
}

function controlarCampoAlteracao() {
    const cliente = inputCliente.value.trim();
    const tipo = selectTipo.value;
    const inputAlteracao = document.getElementById("alteracao");

    if (!cliente || !tipo) {
        inputAlteracao.value = 0;
        inputAlteracao.disabled = true;
        return;
    }

    if (isPrimeiroRegistro(cliente, tipo)) {
        inputAlteracao.value = 0;
        inputAlteracao.disabled = true;
    } else {
        inputAlteracao.disabled = false;
    }
}


// ===============================
// CONTROLE DO TEXTO DO CAMPO ALTERAÇÃO
// ===============================

function controlarCampoAlteracao() {
    const cliente = inputCliente.value.trim();
    const tipo = selectTipo.value;
    const inputAlteracao = document.getElementById("alteracao");
    const info = document.getElementById("alteracaoInfo");

    if (!cliente || !tipo) {
        inputAlteracao.value = 0;
        inputAlteracao.disabled = true;
        info.style.display = "none";
        return;
    }

    if (isPrimeiroRegistro(cliente, tipo)) {
        inputAlteracao.value = 0;
        inputAlteracao.disabled = true;
        info.style.display = "block";
    } else {
        inputAlteracao.disabled = false;
        info.style.display = "none";
    }
}

// ===============================
// RESETAR CAMPO ALTERAÇÃO
// ===============================
function resetarCampoAlteracao() {
    const inputAlteracao = document.getElementById("alteracao");
    const info = document.getElementById("alteracaoInfo");

    inputAlteracao.value = 0;
    inputAlteracao.disabled = true;
    info.style.display = "none";
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


    

    // Capturar valores
    const data = document.getElementById("data").value;
    const cliente = document.getElementById("cliente").value;
    const tipo = document.getElementById("tipo").value;

// soma histórico + nova alteração
let alteracaoAtual = Number(document.getElementById("alteracao").value);

if (isPrimeiroRegistro(cliente, tipo)) {
    alteracaoAtual = 0;
}





    const formatoExtra = document.getElementById("formatoExtra").value;
    let obs = document.getElementById("obs").value.trim();

if (!obs) {
    obs = buscarObservacoes(cliente, tipo);
}



    // Tratamento da data
    const dataFormatada = formatarDataBr(data);

 

        //MESMO QUE TNEHA 20 ALTERAÇÕES AINDA VAI CONTINUAR SENDO APENAS UM REGISTRO NO LOCALSTORAGE

    // Criar objeto
    const registro = {
        data: dataFormatada,
        cliente,
        tipo,
        alteracoes: alteracaoAtual,
        formatoExtra,
        obs,
  
        
    };


    // Adicionar à tabela
    salvarRegistro(registro);
    carregarRegistros();

    // reset do texto de alteração
    resetarCampoAlteracao();



    

    // Limpar formulário
    document.getElementById("registroForm").reset();
});

// ===============================
// Quando abrir a página
// ===============================
carregarRegistros();



const inputCliente = document.getElementById("cliente");
const selectTipo = document.getElementById("tipo");
const textareaObs = document.getElementById("obs");

function atualizarObservacoes() {
    const cliente = inputCliente.value.trim();
    const tipo = selectTipo.value;

    if (!cliente || !tipo) {
        textareaObs.value = "";
        return;
    }

    textareaObs.value = buscarObservacoes(cliente, tipo) || "";
}


inputCliente.addEventListener("blur", () => {
    atualizarObservacoes();
    controlarCampoAlteracao();
});

selectTipo.addEventListener("change", () => {
    textareaObs.value = "";
    atualizarObservacoes();
    controlarCampoAlteracao();
});


// FUNÇÃO DE SOMA
function calcularTotalAlteracoes(cliente, tipo) {
    const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];

    return registros
        .filter(r => r.cliente === cliente && r.tipo === tipo)
        .reduce((total, r) => total + r.alteracoes, 0);
}


function calcularFaixa(totalArtes) {
    if (totalArtes <= 20) return 1;
    if (totalArtes <= 60) return 2;
    return 3;
}

function valorBase(tipo, faixa) {
    const tabela = {
        Estático: [25, 20, 15],
        Carrossel: [45, 40, 35]
    };
    return tabela[tipo][faixa - 1];
}

function calcularValor(registro, faixaAtual) {
    let valor = valorBase(registro.tipo, faixaAtual);

    if (registro.alteracoes >= 3) {
        valor *= 0.5;
    }


    if (registro.formatoExtra === "Sim") {
        valor *= 1.5;
    }

    return valor;
}

controlarCampoAlteracao();


// localStorage.clear();
// localStorage.removeItem("registrosArtes");


