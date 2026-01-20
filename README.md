# 📊 Sistema de Registro e Cálculo de Artes

Este projeto é uma aplicação **100% front-end**, desenvolvida em **HTML, CSS e JavaScript puro**, com foco em **registro, cálculo automático de valores, filtros estilo Excel e visualização em dashboard**.

Todos os dados são armazenados localmente no navegador usando **LocalStorage**, sem necessidade de backend.

---

## 🚀 Funcionalidades Principais

* Cadastro de registros de artes
* Cálculo automático de valores por faixa
* Controle de alterações por cliente/projeto
* Dashboard com:

  * Total de registros
  * Valor total calculado
* Filtros por coluna (estilo Excel)
* Exportação para Excel (.xlsx)
* Exclusão de registros com alerta visual
* Persistência de dados no navegador

---

## 🧠 Como os Dados São Armazenados

O sistema utiliza o **LocalStorage** do navegador.

### Chave utilizada:

```
registrosArtes
```

### Estrutura de cada registro:

```js
{
  data: "DD/MM/YYYY",
  cliente: "Nome do cliente ou projeto",
  tipo: "Estático | Carrossel",
  alteracoes: Number,
  formatoExtra: "Sim | Não",
  obs: "Texto opcional"
}
```

Todos os registros ficam armazenados em um **array JSON**, permitindo:

* Persistência após recarregar a página
* Filtros dinâmicos
* Recalcular valores automaticamente

---

## 🧮 Regras de Cálculo

### 📦 Faixas de Preço

A faixa é calculada com base **na quantidade total de registros**:

| Total de Registros | Faixa |
| ------------------ | ----- |
| Até 20             | 1     |
| 21 a 60            | 2     |
| Acima de 60        | 3     |

---

### 💰 Valores Base por Tipo

#### Estático

| Faixa | Valor |
| ----- | ----- |
| 1     | R$ 25 |
| 2     | R$ 20 |
| 3     | R$ 15 |

#### Carrossel

| Faixa | Valor |
| ----- | ----- |
| 1     | R$ 45 |
| 2     | R$ 40 |
| 3     | R$ 35 |

---

### ✏️ Regra de Alterações

* A **primeira arte** de um cliente/projeto **não permite alterações**
* A partir da **3ª alteração acumulada**, o valor sofre:

```
50% de desconto sobre o valor atual
```

---

### ➕ Formato Extra

Se o campo **Formato Extra** for marcado como `"Sim"`:

```
Valor final recebe +50%
```

---

## 📊 Dashboard

O dashboard exibe dois indicadores em tempo real:

### 🔢 Total de Registros

* Mostra quantas linhas estão visíveis
* É atualizado automaticamente ao:

  * Adicionar registro
  * Remover registro
  * Aplicar filtros

### 💰 Valor Total

* Soma os valores calculados das linhas visíveis
* Recalcula automaticamente ao aplicar filtros

---

## 🔍 Filtros Estilo Excel

* Cada coluna possui um botão de filtro
* Ao clicar:

  * Abre um dropdown com todos os valores únicos da coluna
  * Permite marcar/desmarcar valores
* Botões disponíveis:

  * **Aplicar** → filtra a tabela
  * **Limpar** → remove o filtro da coluna

### Comportamento dos filtros:

* Funcionam de forma combinada
* Atualizam:

  * Linhas visíveis
  * Total de registros
  * Valor total do dashboard

---

## 📤 Exportação para Excel

O botão **Exportar** gera um arquivo `.xlsx` contendo:

* Todos os registros armazenados
* Valores já calculados
* Faixa aplicada
* Total de alterações
* Observações

O nome do arquivo segue o padrão:

```
registros_artes_YYYY-MM-DD.xlsx
```

---

## 🗑️ Exclusão de Registros

* Cada linha possui um botão **X**
* Ao clicar:

  * O registro é removido do LocalStorage
  * A tabela é recarregada
  * Um alerta visual aparece confirmando a exclusão

---

## 🎨 Tecnologias Utilizadas

* HTML5
* CSS3 (Flexbox, Grid, responsivo)
* JavaScript Vanilla
* LocalStorage
* SheetJS (XLSX)

---

## 📌 Observações Finais

* O projeto foi estruturado para ser **simples, performático e fácil de manter**
* Não depende de backend
* Ideal para controle interno, protótipos ou ferramentas administrativas locais

---

Se no futuro for necessário:

* Backend
* Autenticação
* Banco de dados real

A lógica atual pode ser reaproveitada sem grandes mudanças.

---

```
```
