let produtos = [
  { id: "PAO001", nome: "Pão Francês", preco: 0.8, estoque: 200, vendidos: 0, promocao: 0, imagem: "imagens/pao-frances.png" },
  { id: 'SAL001', nome: 'Croissant', preco: 6.0, estoque: 50, vendidos: 0, promocao: 0, imagem: "imagens/croissant.png" },
  { id: 'BEB001', nome: 'Café Expresso', preco: 3.0, estoque: 100, vendidos: 0, promocao: 0, imagem: "imagens/cafe.jpg" },
  { id: 'SAL002', nome: 'Pão de Queijo', preco: 6.0, estoque: 100, vendidos: 0, promocao: 0, imagem: "imagens/pao-de-queijo.png" },
  { id: 'DOC001', nome: 'Donut Gourmet', preco: 8.0, estoque: 50, vendidos: 0, promocao: 0, imagem: "imagens/donut.png" },
  { id: 'BEB002', nome: 'Suco Natural', preco: 5.0, estoque: 100, vendidos: 0, promocao: 0, imagem: "imagens/sucos.png" },
];

let carrinho = [];
let pontos = 0;
let historico = [];

/*  BUSCA  */
function filtrarProdutos() {
  const termo = (document.getElementById('buscaProduto')?.value || '').toLowerCase();
  const container = document.getElementById('produtos');
  if (!container) return;
  container.innerHTML = '';

  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  if (filtrados.length === 0) {
    container.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  filtrados.forEach(produto => {
    container.appendChild(criarCardProduto(produto));
  });
}

function criarCardProduto(produto) {
  const card = document.createElement('div');
  card.classList.add('produto');

  // preço com promoção se houver
  let precoHTML = `Preço: R$ ${produto.preco.toFixed(2)}`;
  if (produto.promocao && produto.promocao > 0) {
    const precoFinal = (produto.preco * (100 - produto.promocao)) / 100;
    precoHTML = `<span style="text-decoration:line-through;color:#999;">R$ ${produto.preco.toFixed(2)}</span> <strong style="color:red">R$ ${precoFinal.toFixed(2)}</strong>`;
  }

 card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img">
    <h3>${produto.nome}</h3>
    <p>${precoHTML}</p>
    <div class="quantidade-container">
      <button class="quantidade-btn" onclick="alterarQtdCatalogo('${produto.id}', -1)">−</button>
      <span id="qtd-${produto.id}">1</span>
      <button class="quantidade-btn" onclick="alterarQtdCatalogo('${produto.id}', 1)">+</button>
    </div>
    <button onclick="adicionarCarrinho('${produto.id}', getQtd('${produto.id}'))">Adicionar ao Carrinho</button>
    <button onclick="toggleDetalhes('${produto.id}')">🔍 Ver Detalhes</button>
    <div id="detalhes-${produto.id}" class="detalhes-produto" style="display:none;">
      <p>Estoque disponível: ${produto.estoque}</p>
      <p>ID: ${produto.id}</p>
    </div>
  `;
  return card;
}

/* Funções para quantidade no catálogo */
function alterarQtdCatalogo(id, delta) {
  const span = document.getElementById(`qtd-${id}`);
  if (!span) return;
  let qtd = parseInt(span.textContent) || 1;
  qtd += delta;
  if (qtd < 1) qtd = 1;
  span.textContent = qtd;
}

function getQtd(id) {
  return parseInt(document.getElementById(`qtd-${id}`)?.textContent) || 1;
}

/*  CATALOGO / EXIBIÇÃO  */
function exibirProdutos() {
  const container = document.getElementById('produtos');
  if (!container) return;
  container.innerHTML = '';
  produtos.forEach(produto => container.appendChild(criarCardProduto(produto)));
}

/*  CARRINHO  */
function adicionarCarrinho(id, qtd = 1) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return alert('Produto não encontrado');
  if (produto.estoque <= 0) return alert('Produto indisponível');

  let item = carrinho.find(i => i.id === id);
  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }
  produto.estoque -= qtd;
  mostrarNotificacao(`${qtd}x ${produto.nome} adicionado ao carrinho!`);
  renderCarrinho();
}

function mostrarNotificacao(msg) {
  const div = document.createElement("div");
  div.className = "notificacao";
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.classList.add("show"), 50);
  setTimeout(() => { div.classList.remove("show"); setTimeout(()=>div.remove(), 500); }, 2000);
}

function renderCarrinho() {
  const tbody = document.getElementById('itens-carrinho');
  if (!tbody) return;

  tbody.innerHTML = '';
  let subtotal = 0;

  carrinho.forEach((item, index) => {
    const itemSubtotal = item.preco * item.quantidade;
    subtotal += itemSubtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>R$ ${item.preco.toFixed(2)}</td>
      <td>
        <button onclick="alterarQuantidade(${index}, -1)" class="quantidade-btn">-</button>
        ${item.quantidade}
        <button onclick="alterarQuantidade(${index}, 1)" class="quantidade-btn">+</button>
      </td>
      <td>R$ ${itemSubtotal.toFixed(2)}</td>
      <td><button class="remover" onclick="removerItem(${index})">Remover</button></td>
    `;
    tbody.appendChild(tr);
  });

  // cálculos
  let descontoQuantidade = carrinho.reduce((acc, i) => acc + i.quantidade, 0) >= 10 ? subtotal * 0.1 : 0;
  let descontoCupom = parseFloat(document.getElementById('descontoCupom')?.value) || 0;
  let imposto = parseFloat(document.getElementById('imposto')?.value) || 0;
  let entrega = parseFloat(document.getElementById('entrega')?.value) || 0;
  let usarPontos = parseFloat(document.getElementById('usarPontos')?.value) || 0;

  if (usarPontos > pontos) {
    usarPontos = pontos;
    const inp = document.getElementById('usarPontos');
    if (inp) inp.value = usarPontos;
  }

  let valorImposto = ((subtotal - descontoQuantidade) * imposto) / 100;
  let total = subtotal - descontoQuantidade + valorImposto + entrega - descontoCupom - usarPontos;
  if (total < 0) total = 0;

  // Atualiza DOM
  document.getElementById('subtotal') && (document.getElementById('subtotal').textContent = formatar(subtotal));
  document.getElementById('descontoQuantidade') && (document.getElementById('descontoQuantidade').textContent = formatar(descontoQuantidade));
  document.getElementById('impostos') && (document.getElementById('impostos').textContent = formatar(valorImposto));
  document.getElementById('entregaValor') && (document.getElementById('entregaValor').textContent = formatar(entrega));
  document.getElementById('descontoCupomTexto') && (document.getElementById('descontoCupomTexto').textContent = formatar(descontoCupom));
  document.getElementById('descontoPontos') && (document.getElementById('descontoPontos').textContent = formatar(usarPontos));
  document.getElementById('total') && (document.getElementById('total').textContent = formatar(total));

  // salva carrinho
  try { localStorage.setItem('carrinho', JSON.stringify(carrinho)); } catch(e){ /* ignore */ }

  // atualizar pagamento
  calcularTroco();
  converterMoeda();
}

/* alterar quantidade */
function alterarQuantidade(index, delta) {
  const item = carrinho[index];
  if (!item) return;
  const produto = produtos.find(p => p.id === item.id);
  if (!produto) return;

  if (delta === 1) {
    if (produto.estoque <= 0) return alert('Sem estoque');
    item.quantidade++;
    produto.estoque--;
  } else {
    item.quantidade--;
    produto.estoque++;
    if (item.quantidade <= 0) carrinho.splice(index, 1);
  }
  renderCarrinho();
}

/* remover item */
function removerItem(index) {
  const item = carrinho[index];
  if (!item) return;
  const produto = produtos.find(p => p.id === item.id);
  if (produto) produto.estoque += item.quantidade;
  carrinho.splice(index, 1);
  renderCarrinho();
}

/* Mostrar/ocultar detalhes */
function toggleDetalhes(id) {
  const detalhes = document.getElementById(`detalhes-${id}`);
  if (detalhes) {
    detalhes.style.display = detalhes.style.display === "none" ? "block" : "none";
  }
}

/* Limpar carrinho com confirmação */
function limparCarrinho() {
  if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
    carrinho = [];
    localStorage.removeItem('carrinho');
    renderCarrinho();
  }
}

/* finalizar compra */
function finalizarCompra() {
  if (carrinho.length === 0) return alert('Carrinho vazio');

  let subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
  let descontoQuantidade = carrinho.reduce((acc, i) => acc + i.quantidade, 0) >= 10 ? subtotal * 0.1 : 0;
  let descontoCupom = parseFloat(document.getElementById('descontoCupom')?.value) || 0;
  let imposto = parseFloat(document.getElementById('imposto')?.value) || 0;
  let entrega = parseFloat(document.getElementById('entrega')?.value) || 0;
  let usarPontos = parseFloat(document.getElementById('usarPontos')?.value) || 0;
  if (usarPontos > pontos) usarPontos = pontos;

  let valorImposto = ((subtotal - descontoQuantidade) * imposto) / 100;
  let total = subtotal - descontoQuantidade + valorImposto + entrega - descontoCupom - usarPontos;
  if (total < 0) total = 0;

  // pontos
  let pontosGanhos = Math.floor(total / 10);
  pontos -= usarPontos;
  pontos += pontosGanhos;
  if (pontos < 0) pontos = 0;
  atualizarPontos();

  // ✅ Atualiza vendidos
  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    if (produto) {
      produto.vendidos += item.quantidade;
    }
  });

  historico.push({ itens: [...carrinho], total, data: new Date() });
  carrinho = [];
  localStorage.removeItem('carrinho');
  document.getElementById('usarPontos') && (document.getElementById('usarPontos').value = 0);

  // ✅ Limpar formulário de checkout após finalização
const formCheckout = document.getElementById("checkoutForm");
if (formCheckout) {
  formCheckout.reset();
  // Resetar contador e mensagens
  const charCount = document.getElementById("charCountEndereco");
  if (charCount) charCount.textContent = "0/200";
  document.getElementById("erroNome").textContent = "";
  document.getElementById("erroEmail").textContent = "";
  document.getElementById("erroEndereco").textContent = "";
  document.getElementById("forcaSenhaCheckout").textContent = "";
}

  alert(`Compra finalizada! Total: R$ ${total.toFixed(2)}. Você usou ${usarPontos} pontos e ganhou ${pontosGanhos} pontos.`);
  renderCarrinho();
  renderEstatisticas();
  renderPainel();

}

/*  PONTOS  */
function atualizarPontos() {
  const el = document.getElementById('pontosDisponiveis');
  if (el) el.value = pontos;
}

/*  FORMATOS  */
function formatar(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

/*  PAGAMENTO  */
function calcularTroco() {
  const totalTexto = (document.getElementById('total')?.textContent || 'R$ 0,00').replace('R$', '').replace('.', '').replace(',', '.');
  const total = parseFloat(totalTexto) || 0;
  const pago = parseFloat(document.getElementById('valorPago')?.value) || 0;
  let troco = pago - total;
  if (troco < 0) troco = 0;
  document.getElementById('troco') && (document.getElementById('troco').value = troco.toFixed(2).replace('.', ','));
}

function converterMoeda() {
  const totalTexto = (document.getElementById('total')?.textContent || 'R$ 0,00').replace('R$', '').replace('.', '').replace(',', '.');
  const total = parseFloat(totalTexto) || 0;
  const moeda = document.getElementById('moeda')?.value || 'BRL';
  let convertido = total;
  if (moeda === "USD") convertido = total / 5.0;
  if (moeda === "EUR") convertido = total / 6.0;
  const simbolo = moeda === "USD" ? "$" : moeda === "EUR" ? "€" : "R$";
  document.getElementById('totalConvertido') && (document.getElementById('totalConvertido').textContent = simbolo + " " + convertido.toFixed(2));
}

/*  ESTATÍSTICAS  */
function renderEstatisticas() {
  const div = document.getElementById('estatisticas');
  if (!div) return;

  let pedidos = historico.length;
  let faturamento = historico.reduce((s, h) => s + (h.total || 0), 0);

  // produto mais vendido
  const maisVendido = produtos.reduce((a, b) => (a.vendidos > b.vendidos ? a : b));
  let textoMaisVendido = "Nenhum produto vendido ainda";
  if (maisVendido.vendidos > 0) {
    textoMaisVendido = `${maisVendido.nome} (${maisVendido.vendidos})`;
  }

  div.innerHTML = `
    <ul>
      <li>Pedidos hoje: ${pedidos}</li>
      <li>Faturamento (R$): ${faturamento.toFixed(2)}</li>
      <li>Produto mais vendido: <strong>${textoMaisVendido}</strong></li>
    </ul>
  `;
}

/*  PAINEL ADMINISTRATIVO  */
function renderPainel() {
  const precosDiv = document.getElementById('painel-precos');
  const estoqueDiv = document.getElementById('painel-estoque');

  if (precosDiv) {
    precosDiv.innerHTML = '';
    produtos.forEach((p, i) => {
      precosDiv.innerHTML += `
        <div class="painel-item">
          <label>${p.nome}</label>
          Preço (R$): <input type="number" step="0.01" value="${p.preco}" onchange="atualizarPreco(${i}, this.value)">
          Promo (%): <input type="number" value="${p.promocao || 0}" onchange="atualizarPromocao(${i}, this.value)">
        </div>
      `;
    });
  }

  if (estoqueDiv) {
    estoqueDiv.innerHTML = '';
    produtos.forEach(p => {
      estoqueDiv.innerHTML += `
        <div class="painel-item">
          <label>${p.nome}</label>
          Estoque: <input type="number" value="${p.estoque}" onchange="atualizarEstoque('${p.id}', this.value)">
          Vendidos: ${p.vendidos || 0}
        </div>
      `;
    });
  }

  // atualiza estatísticas
  renderEstatisticas();
}

function atualizarPreco(index, valor) {
  produtos[index].preco = parseFloat(valor) || 0;
  exibirProdutos();
  renderCarrinho();
  renderPainel();
}

function atualizarPromocao(index, valor) {
  produtos[index].promocao = parseFloat(valor) || 0;
  exibirProdutos();
  renderCarrinho();
  renderPainel();
}

function atualizarEstoque(id, valor) {
  const produto = produtos.find(p => p.id === id);
  if (produto) produto.estoque = parseInt(valor) || 0;
  exibirProdutos();
  renderCarrinho();
  renderPainel();
}

function limparDados() {
  try { localStorage.removeItem('carrinho'); } catch(e){}
  historico = [];
  pontos = 0;
  produtos.forEach(p => p.vendidos = 0);
  atualizarPontos();
  renderPainel();
  renderCarrinho();
  renderEstatisticas();
}

/*  INICIALIZAÇÃO  */
window.onload = () => {
  // tentar restaurar carrinho salvo
  try {
    const salvo = localStorage.getItem('carrinho');
    if (salvo) carrinho = JSON.parse(salvo);
  } catch (e) { carrinho = []; }

  exibirProdutos();
  renderCarrinho();
  renderEstatisticas();
  atualizarPontos();
  renderPainel();

 // Mensagem de boas-vindas
setTimeout(() => {
  alert("👋 Bem-vindo(a) à Padaria Doce Sabor! Aproveite nossas delícias fresquinhas 😋🥖☕");
}, 500);

  // Botão voltar ao topo - só adiciona listeners se o elemento existir
  const botaoTopo = document.getElementById("back-to-top");
  if (botaoTopo) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) botaoTopo.classList.add("show");
      else botaoTopo.classList.remove("show");
    });
    botaoTopo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Menu responsivo
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Fecha menu ao clicar em link
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("show"));
  });
}
};

// Validação email
const emailInput = document.getElementById("email");
const emailErro = document.getElementById("emailErro");
if (emailInput) {
  emailInput.addEventListener("input", () => {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!regex.test(emailInput.value)) {
      emailErro.textContent = "⚠️ Email inválido";
      emailErro.style.display = "block";
    } else {
      emailErro.textContent = "";
      emailErro.style.display = "none";
    }
  });
}

// Força da senha
const senhaInput = document.getElementById("senha");
const forcaSenha = document.getElementById("forcaSenha");
if (senhaInput) {
  senhaInput.addEventListener("input", () => {
    const val = senhaInput.value;
    let nivel = "Fraca";
    let cor = "red";

    if (val.length > 6 && /[A-Z]/.test(val) && /\d/.test(val) && /[@$!%*?&]/.test(val)) {
      nivel = "Forte";
      cor = "green";
    } else if (val.length > 4 && /\d/.test(val)) {
      nivel = "Média";
      cor = "orange";
    }
    forcaSenha.textContent = `Força: ${nivel}`;
    forcaSenha.style.color = cor;
  });
}

// Prevenir envio se inválido
const form = document.getElementById("contatoForm");
if (form) {
  form.addEventListener("submit", (e) => {
    if (emailErro.textContent || !senhaInput.value) {
      e.preventDefault();
      alert("❌ Corrija os erros antes de enviar.");
    }
  });
}

let produtoSelecionadoIndex = 0; // controle para navegação com setas

// Atalhos globais
document.addEventListener("keydown", (e) => {
  // Ctrl + Enter = adicionar produto atual
  if (e.ctrlKey && e.key === "Enter") {
    const produtoAtual = produtos[produtoSelecionadoIndex];
    if (produtoAtual) {
      adicionarCarrinho(produtoAtual.id, 1);
    }
  }

  // Navegação ⬅️ ➡️ entre produtos
  if (e.key === "ArrowRight") {
    moverSelecao(1);
  }
  if (e.key === "ArrowLeft") {
    moverSelecao(-1);
  }
});

// Destacar produto atual
function moverSelecao(delta) {
  const cards = document.querySelectorAll("#produtos .produto");
  if (!cards.length) return;
  cards[produtoSelecionadoIndex]?.classList.remove("selecionado");

  produtoSelecionadoIndex = (produtoSelecionadoIndex + delta + cards.length) % cards.length;
  cards[produtoSelecionadoIndex]?.classList.add("selecionado");
  cards[produtoSelecionadoIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
}

const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  const nome = document.getElementById("nomeCompleto");
  const email = document.getElementById("emailCheckout");
  const endereco = document.getElementById("endereco");
  const senha = document.getElementById("senhaCheckout");

  const erroNome = document.getElementById("erroNome");
  const erroEmail = document.getElementById("erroEmail");
  const erroEndereco = document.getElementById("erroEndereco");
  const forcaSenhaCheckout = document.getElementById("forcaSenhaCheckout");
  const charCountEndereco = document.getElementById("charCountEndereco");

  // contador de caracteres do endereço
  endereco.addEventListener("input", () => {
    charCountEndereco.textContent = `${endereco.value.length}/200`;
  });

  // força da senha
  senha.addEventListener("input", () => {
    const val = senha.value;
    let nivel = "Fraca";
    let cor = "red";
    if (val.length > 6 && /[A-Z]/.test(val) && /\d/.test(val) && /[@$!%*?&]/.test(val)) {
      nivel = "Forte"; cor = "green";
    } else if (val.length > 4 && /\d/.test(val)) {
      nivel = "Média"; cor = "orange";
    }
    forcaSenhaCheckout.textContent = `Força: ${nivel}`;
    forcaSenhaCheckout.style.color = cor;
  });

  // validação ao enviar
  checkoutForm.addEventListener("submit", (e) => {
    let valido = true;

    if (!nome.value.trim()) {
      erroNome.textContent = "Nome obrigatório";
      valido = false;
    } else erroNome.textContent = "";

    const regexEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!regexEmail.test(email.value)) {
      erroEmail.textContent = "Email inválido";
      valido = false;
    } else erroEmail.textContent = "";

    if (endereco.value.trim().length < 10) {
      erroEndereco.textContent = "Endereço muito curto";
      valido = false;
    } else erroEndereco.textContent = "";

    if (senha.value.length < 4) {
      forcaSenhaCheckout.textContent = "Senha fraca demais!";
      forcaSenhaCheckout.style.color = "red";
      valido = false;
    }

    if (!valido) {
      e.preventDefault();
      alert("⚠️ Corrija os erros antes de confirmar o pedido.");
    } else {
    e.preventDefault(); // impede reload
    finalizarCompra();  // chama a função do carrinho
  }
});
}

/*  FIM  */