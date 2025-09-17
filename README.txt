# Prática 11 - Eventos em JavaScript

## Estrutura do Projeto
📄 index.html → Estrutura da loja virtual (produtos, carrinho, formulário, busca).  
🎨 styles.css → Estilização da interface.  
💻 script.js → Implementação dos eventos em JavaScript.  
📂 imagens/ → Contém imagens simuladas (logo, banner e produto).  

---
## Eventos Implementados

### 1. Eventos de Clique (click)
- **Adicionar ao Carrinho** (`.add-carrinho`) → Mostra mensagem de confirmação no carrinho.  
- **Ver Detalhes** (`.ver-detalhes`) → Alterna a exibição da descrição do produto.  
- **Botões + e −** (`.mais` e `.menos`) → Aumentam/diminuem a quantidade exibida.  
- **Limpar Carrinho** (`.limpar-carrinho`) → Solicita confirmação antes de esvaziar.  

### 2. Eventos de Mouse (mouseover / hover via CSS)
- **Imagem do Produto** (`.produto-img`) → Aumenta o tamanho ao passar o mouse (efeito hover).  
- **Botões** (`.btn:hover`) → Mudam de cor ao passar o mouse.  
- **Área do Produto** (`.produto`) → Ganha foco visual com a navegação por teclado (tabindex).  

### 3. Eventos de Formulário
- **Validação de Email (keyup)** → Verifica formato em tempo real e exibe mensagem de erro.  
- **Força da Senha (keyup)** → Mostra barra de força da senha enquanto digita.  
- **Textarea (input)** → Mostra contador de caracteres digitados.  
- **Formulário (submit)** → Impede envio se email inválido ou senha curta.  

### 4. Eventos de Teclado (keydown / keyup)
- **Campo de Busca (keyup)** → Filtra produtos dinamicamente conforme o usuário digita.  
- **Atalho Ctrl+Enter (keydown)** → Adiciona produto ao carrinho.  
- **Setas Esquerda/Direita (keydown)** → Permite navegar entre produtos (foco muda).  

### 5. Evento de Carregamento (DOMContentLoaded)
- O código JavaScript só executa após o carregamento da página.  

---
## Especificações Técnicas Atendidas
✅ Uso de `addEventListener()` em todos os eventos.  
✅ Pelo menos 5 tipos diferentes de eventos implementados.  
✅ Comentários no código para explicar a função de cada evento.  
✅ Estrutura de projeto conforme solicitado no enunciado.  

--- 

✅Link com o Resultado do site:
https://elisangelafelix.github.io/Projeto-Site-JS-Pratica11/
