//SE FOR ARTE ESTÁTICA && QUANT <=20 - (FAIXA 1)
//FAIXA 1 == R$25


//SE FOR ARTE ESTÁTICA QUANT >= 21 && <= 60 - (FAIXA 2)
//FAIXA 2 == 20


//FAIXA 3 == 15

//quant >= 61 faixa 3

// 25;
// 20;
// 15;

// 45;
// 40;
// 35;


// registrosSalvos.length

const EstaticoFaixa1 = '';
const EstaticoFaixa2 = '';
const EstaticoFaixa3 = '';

const CarrosselFaixa1 = '';
const CarrosselFaixa2 = '';
const CarrosselFaixa3 = '';

const quant = 0;
const faixa = 0;
const valorUnitario = 0;


// A PARTIR DA TERCEIRA ALTERAÇÃO É 50% A MENOS APLICADO NO VALOR DA FAIXA ATUAL

// FAIXA 1
if (registrosSalvos.length <=20 && tipo == "Estático" && alteracoes <= 2 ){
    
    valorUnitario = 25;

}else if(registrosSalvos.length <=20 && tipo == "Carrosel" && alteracoes <= 2 ){
    valorUnitario = 45;
    
}else if (registrosSalvos.length <=20 && tipo == "Estático" && alteracoes >= 3){
    valorUnitario = 12.50;

}else if(registrosSalvos.length <=20 && tipo == "Carrosel" && alteracoes >= 3){
    valorUnitario = 22.50;
}


// FAIXA 2
if (registrosSalvos.length  >= 21 && registrosSalvos.length <= 60 && tipo == "Estático" && alteracoes <= 2  ){
    
    valorUnitario = 20;

}else if (registrosSalvos.length  >= 21 && registrosSalvos.length <= 60 && tipo == "Carrossel" && alteracoes <= 2 ){
    
    valorUnitario = 40;

}else if (registrosSalvos.length  >= 21 && registrosSalvos.length <= 60 && tipo == "Estático" && alteracoes >= 3){
    valorUnitario = 10;

}else if(registrosSalvos.length  >= 21 && registrosSalvos.length <= 60 && tipo == "Carrossel" && alteracoes >= 3){
    valorUnitario = 20;
}


// FAIXA 3
if (registrosSalvos.length >=61 && tipo == "Estático" && alteracoes <= 2 ){
    
    valorUnitario = 15;

}else if (registrosSalvos.length >=61 && tipo == "Carrossel" && alteracoes <= 2){

    valorUnitario = 35;
}else if (registrosSalvos.length >=61 && tipo == "Estático" && alteracoes >= 3 ){
    
    valorUnitario = 7.50;
}
else if (registrosSalvos.length >=61 && tipo == "Carrossel" && alteracoes >= 3 ){
    
    valorUnitario = 17.50;
}



