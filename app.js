/* =========================================================
   ESTADO GLOBAL
   Controla filtros ativos da tabela (estilo Excel)
========================================================= */
const filtrosAtivos = {};

/* =========================================================
   UTILITÁRIOS
========================================================= */

/**
 * Converte data ISO (YYYY-MM-DD) para formato brasileiro
 */
function formatarDataBr(dataISO) {
  const partes = dataISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/**
 * Busca a última observação registrada para um cliente + tipo
 */
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

/* =========================================================
   EXPORTAÇÃO XLSX
========================================================= */
document.getElementById("btnExportar").addEventListener("click", function () {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];

  if (registros.length === 0) {
    alert("Não há registros para exportar.");
    return;
  }

  const faixaAtual = calcularFaixa(registros.length);

  const dados = registros.map((registro) => {
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
      Observações: registro.obs || "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

  const hoje = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `registros_artes_${hoje}.xlsx`);
});

/* =========================================================
   CARREGAMENTO PRINCIPAL DA TABELA
========================================================= */
function carregarRegistros() {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
  const tbody = document.querySelector("#tabelaRegistros tbody");

  tbody.innerHTML = "";

  registros.forEach((registro, index) => {
    adicionarLinhaTabela(registro, index, registros.length);
  });

  atualizarContadorRegistros();
  atualizarValorTotal();
}

/* =========================================================
   DASHBOARD
========================================================= */

/**
 * Atualiza contador total de registros
 */
function atualizarContadorRegistros() {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
  const contador = document.getElementById("totalRegistros");

  if (contador) contador.innerText = registros.length;
}

/**
 * Calcula valor total geral
 */
function calcularValorTotal() {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
  if (registros.length === 0) return 0;

  const faixaAtual = calcularFaixa(registros.length);
  let total = 0;

  registros.forEach((registro) => {
    const totalAlteracoes = calcularTotalAlteracoes(
      registro.cliente,
      registro.tipo
    );

    total += calcularValor(
      { ...registro, alteracoes: totalAlteracoes },
      faixaAtual
    );
  });

  return total;
}

/**
 * Atualiza valor total exibido no dashboard
 */
function atualizarValorTotal() {
  const elValor = document.getElementById("valorTotal");
  if (!elValor) return;

  elValor.innerText = `R$ ${calcularValorTotal().toFixed(2)}`;
}

/* =========================================================
   REMOÇÃO DE REGISTROS
========================================================= */
function removerRegistro(indice) {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
  registros.splice(indice, 1);
  localStorage.setItem("registrosArtes", JSON.stringify(registros));

  carregarRegistros();
  mostrarAlertaExclusao();
}

/**
 * Alerta visual ao excluir registro
 */
function mostrarAlertaExclusao() {
  const alerta = document.getElementById("alertaExclusao");

  alerta.classList.add("mostrar");

  setTimeout(() => {
    alerta.classList.remove("mostrar");
  }, 2500);
}

/* =========================================================
   FILTROS (ESTILO EXCEL)
========================================================= */

/**
 * Inicializa evento dos ícones de filtro no cabeçalho
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      removerFiltrosAbertos();

      const th = this.closest("th");
      const coluna = th.dataset.col;
      const indexColuna = Array.from(th.parentNode.children).indexOf(th);

      criarFiltro(th, coluna, indexColuna);
    });
  });
});

/**
 * Cria dropdown de filtro com valores únicos da coluna
 */
function criarFiltro(th, coluna, indexColuna) {
  const valores = new Set();

  document.querySelectorAll("#tabelaRegistros tbody tr").forEach((tr) => {
    const td = tr.children[indexColuna];
    if (td) valores.add(td.innerText.trim());
  });

  const box = document.createElement("div");
  box.className = "filtro-box";

  box.addEventListener("click", (e) => e.stopPropagation());

  valores.forEach((valor) => {
    const checked =
      !filtrosAtivos[coluna] || filtrosAtivos[coluna].includes(valor);

    box.innerHTML += `
      <label>
        <input type="checkbox" value="${valor}" ${checked ? "checked" : ""}>
        ${valor}
      </label>
    `;
  });

  const acoes = document.createElement("div");
  acoes.className = "filtro-acoes";

  const btnAplicar = document.createElement("button");
  btnAplicar.innerText = "Aplicar";
  btnAplicar.addEventListener("click", () =>
    aplicarFiltro(coluna, indexColuna, btnAplicar)
  );

  const btnLimpar = document.createElement("button");
  btnLimpar.innerText = "Limpar";
  btnLimpar.addEventListener("click", () => limparFiltro(coluna));

  acoes.appendChild(btnAplicar);
  acoes.appendChild(btnLimpar);
  box.appendChild(acoes);

  document.body.appendChild(box);

  const rect = th.getBoundingClientRect();
  box.style.top = rect.bottom + window.scrollY + "px";
  box.style.left = rect.left + window.scrollX + "px";
}

/**
 * Aplica filtro selecionado
 */
function aplicarFiltro(coluna, indexColuna, btn) {
  const box = btn.closest(".filtro-box");
  const checks = box.querySelectorAll("input[type=checkbox]:checked");

  filtrosAtivos[coluna] = Array.from(checks).map((c) => c.value);

  aplicarFiltrosTabela();
  removerFiltrosAbertos();
}

/**
 * Limpa filtro de uma coluna
 */
function limparFiltro(coluna) {
  delete filtrosAtivos[coluna];
  aplicarFiltrosTabela();
  removerFiltrosAbertos();
}

/**
 * Aplica todos os filtros ativos na tabela
 */
function aplicarFiltrosTabela() {
  document.querySelectorAll("#tabelaRegistros tbody tr").forEach((tr) => {
    let visivel = true;

    Object.entries(filtrosAtivos).forEach(([coluna, valores]) => {
      const th = document.querySelector(`th[data-col="${coluna}"]`);
      const index = Array.from(th.parentNode.children).indexOf(th);
      const texto = tr.children[index].innerText.trim();

      if (!valores.includes(texto)) visivel = false;
    });

    tr.style.display = visivel ? "" : "none";
  });

  atualizarDashboardFiltrado();
}

/**
 * Atualiza dashboard considerando filtros ativos
 */
function atualizarDashboardFiltrado() {
  const linhasVisiveis = Array.from(
    document.querySelectorAll("#tabelaRegistros tbody tr")
  ).filter((tr) => tr.style.display !== "none");

  document.getElementById("totalRegistros").innerText = linhasVisiveis.length;

  let total = 0;
  linhasVisiveis.forEach((tr) => {
    total += Number(
      tr.children[5].innerText.replace("R$", "").replace(",", ".").trim()
    );
  });

  document.getElementById("valorTotal").innerText = `R$ ${total.toFixed(2)}`;
}

/**
 * Fecha filtros ao clicar fora
 */
function removerFiltrosAbertos() {
  document.querySelectorAll(".filtro-box").forEach((f) => f.remove());
}

document.addEventListener("click", removerFiltrosAbertos);

/* =========================================================
   TABELA
========================================================= */
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
    <td class="col-remover">
      <span class="btn-remover" onclick="removerRegistro(${indice})">x</span>
    </td>
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

/* =========================================================
   FORMULÁRIO
========================================================= */

function isPrimeiroRegistro(cliente, tipo) {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
  return !registros.some((r) => r.cliente === cliente && r.tipo === tipo);
}

function controlarCampoAlteracao() {
  const cliente = inputCliente.value.trim();
  const tipo = selectTipo.value;
  const inputAlteracao = document.getElementById("alteracao");
  const info = document.getElementById("alteracaoInfo");

  if (!cliente || !tipo || isPrimeiroRegistro(cliente, tipo)) {
    inputAlteracao.value = 0;
    inputAlteracao.disabled = true;
    info.style.display = cliente && tipo ? "block" : "none";
  } else {
    inputAlteracao.disabled = false;
    info.style.display = "none";
  }
}

function resetarCampoAlteracao() {
  const inputAlteracao = document.getElementById("alteracao");
  const info = document.getElementById("alteracaoInfo");

  inputAlteracao.value = 0;
  inputAlteracao.disabled = true;
  info.style.display = "none";
}

function salvarRegistro(registro) {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
  registros.push(registro);
  localStorage.setItem("registrosArtes", JSON.stringify(registros));
}

document
  .getElementById("registroForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const cliente = document.getElementById("cliente").value;
    const tipo = document.getElementById("tipo").value;

    let alteracaoAtual = Number(document.getElementById("alteracao").value);
    if (isPrimeiroRegistro(cliente, tipo)) alteracaoAtual = 0;

    let obs = document.getElementById("obs").value.trim();
    if (!obs) obs = buscarObservacoes(cliente, tipo);

    salvarRegistro({
      data: formatarDataBr(document.getElementById("data").value),
      cliente,
      tipo,
      alteracoes: alteracaoAtual,
      formatoExtra: document.getElementById("formatoExtra").value,
      obs,
    });

    carregarRegistros();
    resetarCampoAlteracao();
    this.reset();
  });

/* =========================================================
   REGRAS DE CÁLCULO
========================================================= */
function calcularTotalAlteracoes(cliente, tipo) {
  const registros = JSON.parse(localStorage.getItem("registrosArtes")) || [];
  return registros
    .filter((r) => r.cliente === cliente && r.tipo === tipo)
    .reduce((t, r) => t + r.alteracoes, 0);
}

function calcularFaixa(total) {
  if (total <= 20) return 1;
  if (total <= 60) return 2;
  return 3;
}

function valorBase(tipo, faixa) {
  const tabela = {
    Estático: [25, 20, 15],
    Carrossel: [45, 40, 35],
  };
  return tabela[tipo][faixa - 1];
}

function calcularValor(registro, faixa) {
  let valor = valorBase(registro.tipo, faixa);
  if (registro.alteracoes >= 3) valor *= 0.5;
  if (registro.formatoExtra === "Sim") valor *= 1.5;
  return valor;
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */
carregarRegistros();

const inputCliente = document.getElementById("cliente");
const selectTipo = document.getElementById("tipo");
const textareaObs = document.getElementById("obs");

inputCliente.addEventListener("blur", () => {
  textareaObs.value = buscarObservacoes(inputCliente.value, selectTipo.value);
  controlarCampoAlteracao();
});

selectTipo.addEventListener("change", () => {
  textareaObs.value = "";
  controlarCampoAlteracao();
});
