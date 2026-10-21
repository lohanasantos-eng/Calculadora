const visor = document.querySelector("#visor");

let entrada = "0";
let primeiroNumero = null;
let operador = null;
let novaEntrada = false;

// Atualiza o número exibido.
function atualizarVisor() {
  visor.textContent = entrada.replace(".", ",");
}

// Reinicia a calculadora.
function limpar() {
  entrada = "0";
  primeiroNumero = null;
  operador = null;
  novaEntrada = false;

  atualizarVisor();
}

// Acrescenta um dígito ao número atual.
function adicionarNumero(numero) {
  if (entrada === "Erro") {
    limpar();
  }

  if (novaEntrada) {
    entrada = numero;
    novaEntrada = false;
  } else if (entrada.replace(/[-.]/g, "").length < 12) {
    entrada = entrada === "0" ? numero : entrada + numero;
  }

  atualizarVisor();
}

// Adiciona a casa decimal.
function adicionarDecimal() {
  if (entrada === "Erro") {
    limpar();
  }

  if (novaEntrada) {
    entrada = "0";
    novaEntrada = false;
  }

  if (!entrada.includes(".")) {
    entrada += ".";
  }

  atualizarVisor();
}

// Resolve a operação pendente.
function calcular() {
  if (
    operador === null ||
    primeiroNumero === null ||
    novaEntrada
  ) {
    return;
  }

  const segundoNumero = Number(entrada);
  let resultado;

  switch (operador) {
    case "+":
      resultado = primeiroNumero + segundoNumero;
      break;

    case "-":
      resultado = primeiroNumero - segundoNumero;
      break;

    case "*":
      resultado = primeiroNumero * segundoNumero;
      break;

    case "/":
      resultado = segundoNumero === 0
        ? NaN
        : primeiroNumero / segundoNumero;
      break;
  }

  // Limita a precisão e trata resultados inválidos.
  entrada = Number.isFinite(resultado)
    ? String(Number(resultado.toPrecision(12)))
    : "Erro";

  primeiroNumero = null;
  operador = null;
  novaEntrada = true;

  atualizarVisor();
}

// Guarda o primeiro número e a operação escolhida.
function escolherOperador(proximoOperador) {
  if (entrada === "Erro") {
    return;
  }

  if (operador !== null && !novaEntrada) {
    calcular();
  }

  if (entrada === "Erro") {
    return;
  }

  primeiroNumero = Number(entrada);
  operador = proximoOperador;
  novaEntrada = true;
}

// Executa as ações especiais.
function executarAcao(acao) {
  if (acao === "limpar") {
    limpar();
    return;
  }

  if (acao === "igual") {
    calcular();
    return;
  }

  if (acao === "decimal") {
    adicionarDecimal();
    return;
  }

  if (entrada === "Erro") {
    return;
  }

  if (acao === "apagar" && !novaEntrada) {
    entrada = entrada.slice(0, -1);

    if (entrada === "" || entrada === "-") {
      entrada = "0";
    }
  }

  if (acao === "sinal" && Number(entrada) !== 0) {
    entrada = entrada.startsWith("-")
      ? entrada.slice(1)
      : "-" + entrada;
  }

  atualizarVisor();
}

// Identifica os cliques nos botões.
document.querySelector(".botoes").addEventListener("click", (evento) => {
  const botao = evento.target.closest("button");

  if (!botao) {
    return;
  }

  if (botao.dataset.numero !== undefined) {
    adicionarNumero(botao.dataset.numero);
  } else if (botao.dataset.operador) {
    escolherOperador(botao.dataset.operador);
  } else {
    executarAcao(botao.dataset.acao);
  }
});

// Permite usar a calculadora pelo teclado.
document.addEventListener("keydown", (evento) => {
  if (evento.ctrlKey || evento.metaKey || evento.altKey) {
    return;
  }

  const tecla = evento.key;

  if (/^[0-9]$/.test(tecla)) {
    adicionarNumero(tecla);
  } else if (["+", "-", "*", "/"].includes(tecla)) {
    escolherOperador(tecla);
  } else if (tecla === "." || tecla === ",") {
    adicionarDecimal();
  } else if (tecla === "Enter" || tecla === "=") {
    // Enter mantém o comportamento normal de um botão com foco.
    if (tecla === "Enter" && evento.target.tagName === "BUTTON") {
      return;
    }

    calcular();
  } else if (tecla === "Backspace") {
    executarAcao("apagar");
  } else if (tecla === "Escape") {
    limpar();
  } else {
    return;
  }

  evento.preventDefault();
});