# KitchFlow Tecnologia — KitchFlow Manager

> Sistema integrado de gestão para cozinhas sob demanda (**Dark Kitchens**).
> Projeto Integrador de **Design Profissional** — Universidade Positivo · Docente: Prof. Me. Sedenilso Antonio Machado

**Por:** Uara Gomes e Agatha Moreira

| | |
|---|---|
|  Repositório | https://github.com/agath4moreira/KitchFlow |
|  Demonstração online | https://agath4moreira.github.io/KitchFlow/ |
|  Protótipo (Figma) | https://www.figma.com/file/EKcmHKWHmS2H7nRAbHZqRr?node-id=0:1&locale=pt-br&type=design |
|  Licença | MIT |

---

## Sobre a empresa

A **KitchFlow Tecnologia** é uma startup fictícia de desenvolvimento de software que propõe soluções digitais para melhorar a organização e a eficiência operacional de cozinhas sob demanda, conhecidas como *dark kitchens*. Seu principal produto, o **KitchFlow Manager**, centraliza informações sobre pedidos, controla insumos e acompanha o tempo de preparo e expedição, oferecendo uma visão integrada da operação.

### Problema identificado

Cozinhas que trabalham exclusivamente com delivery podem enfrentar dificuldades para acompanhar pedidos de diferentes plataformas, controlar ingredientes disponíveis e identificar atrasos na preparação e na expedição.

### Proposta de valor

Reunir **pedidos, estoque e acompanhamento de preparo em um único painel**, ajudando dark kitchens a reduzir falhas operacionais, evitar a falta de ingredientes e melhorar o tempo de expedição.

### Justificativa da escolha do segmento

Escolhemos o segmento de Dark Kitchens pela oportunidade de usar a tecnologia para melhorar a organização de negócios que trabalham com delivery. Segundo o enunciado do Projeto Integrador (pesquisa do Prof. Sedenilso Machado, com mais de 40.000 entrevistados), o segmento apresenta **68% de necessidade percebida**. O projeto também permite aplicar conhecimentos de pesquisa com usuários, design de interfaces e desenvolvimento de software, criando uma solução funcional com potencial de evolução.

---

## Equipe e papéis

| Integrante | Função | Atribuições |
|---|---|---|
| **Agatha Moreira** | Desenvolvedora Front-end | Criar as telas com HTML, CSS e JavaScript e implementar a interação entre os componentes. |
| **Agatha Moreira** | Desenvolvedora Back-end e QA | Desenvolver a lógica do sistema, a persistência dos dados, os testes, a integração e a documentação técnica. |
| **Uara Gomes** | UX/UI Designer | Realizar entrevistas em conjunto com a equipe; elaborar personas, jornada do usuário e protótipos no Figma. |
| **Uara Gomes** | Product Owner | Organizar tarefas, definir prioridades, acompanhar o cronograma, apresentar a proposta de valor e realizar ajustes no código. |

---

## Funcionalidades implementadas (MVP)

- **Visão geral:** indicadores de pedidos ativos, em atraso, prontos e alertas de estoque; fila de pedidos recentes; estoque em atenção.
- **Pedidos:** cadastro (itens, canal, horário, observações), filtros por status e busca.
- **Produção:** quadro por status — *Recebido → Preparando → Pronto → Expedido* — com botão para avançar a etapa.
- **Estoque:** cadastro de insumos, atualização de quantidades e alerta quando a quantidade fica abaixo do mínimo.
- **Layout responsivo** para desktop e celular (menu lateral e navegação inferior).
- **Persistência** dos dados no `localStorage` do navegador.

---

## Arquitetura

O MVP adota uma arquitetura **cliente (client-side) em camadas**, executada inteiramente no navegador:

```
Usuário (navegador)
   │
   ├── Interface ........ index.html + styles.css   (telas, diálogos, layout responsivo)
   ├── Lógica ........... script.js                  (estado `data`, regras, renderização, eventos)
   └── Persistência ..... localStorage               (chave 'kitchflow-mvp-v1', JSON)
```

**Fluxo de dados:** ao carregar, `loadData()` lê o JSON do `localStorage` (ou usa os dados iniciais de demonstração). Cada ação altera o objeto `data`, chama `saveData()` (grava o JSON) e `renderAll()` (atualiza as telas).

### Modelo de dados

| Entidade | Campos |
|---|---|
| **Pedido** (`orders`) | `id`, `items`, `channel` (Delivery, Retirada, Aplicativo próprio), `time` (HH:MM), `status` (Recebido, Preparando, Pronto, Expedido), `notes` |
| **Insumo** (`stock`) | `id`, `name`, `quantity`, `minimum`, `unit`, `emoji` |

### Regras de negócio

- O pedido nasce como **Recebido** e avança uma etapa por vez até **Expedido**.
- Um insumo gera **alerta de reposição** quando `quantity < minimum`.
- *Pedidos ativos* = status Recebido ou Preparando.
- *Pedidos em atraso* (regra simplificada do MVP) = status Preparando com horário anterior a 12:00.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Linguagens | HTML5, CSS3, JavaScript (ES6+) |
| Frameworks | Nenhum (JavaScript puro) |
| Persistência | `localStorage` (JSON) |
| Tipografia | Inter (Google Fonts) |
| Design | Figma |
| Versionamento / hospedagem | Git, GitHub e GitHub Pages |

---

## Estrutura do repositório

```
KitchFlow/
├── index.html    # estrutura das telas e diálogos
├── styles.css    # estilos e layout responsivo
├── script.js     # lógica, estado, renderização e persistência
├── README.md     # documentação
└── LICENSE       # licença MIT
```

---

## Como executar localmente

### Pré-requisitos

- Navegador moderno: Google Chrome, Microsoft Edge ou Mozilla Firefox (versões recentes).
- Opcional: Git e Visual Studio Code.
- **Não é necessário instalar dependências nem compilar o projeto.**

### Passo a passo

1. **Obtenha o código**

   ```bash
   git clone https://github.com/agath4moreira/KitchFlow.git
   cd KitchFlow
   ```

   Ou use **Code → Download ZIP** no GitHub e extraia a pasta.

2. **Abra o sistema:** dê dois cliques em `index.html` (ou arraste o arquivo para o navegador).

3. **(Opcional) Servidor local**, se preferir servir por HTTP:

   ```bash
   python3 -m http.server 8000
   # acesse http://localhost:8000
   ```

   No Visual Studio Code, também é possível usar a extensão *Live Server*.

4. **Use o sistema** pelas quatro áreas: Visão geral, Pedidos, Estoque e Produção.

### Reiniciar os dados de demonstração

No console do navegador (F12), com o sistema aberto:

```js
localStorage.removeItem('kitchflow-mvp-v1'); location.reload();
```

### Roteiro sugerido para demonstração

1. Em **Visão geral**, mostrar os indicadores e os alertas de estoque.
2. Em **Pedidos**, clicar em **+ Novo pedido**, preencher e salvar (o pedido surge como *Recebido*).
3. Usar os **filtros** por status e a **busca**.
4. Em **Produção**, avançar o pedido até *Expedido*.
5. Em **Estoque**, atualizar a quantidade de um insumo e ver o alerta sumir.
6. Recarregar a página para mostrar que os dados permanecem salvos.

### Solução de problemas

| Sintoma | Solução |
|---|---|
| Fonte diferente da prevista | Sem internet a fonte Inter não carrega; o sistema usa a fonte padrão e funciona normalmente. |
| Dados não salvam | Use uma janela normal (não anônima) do navegador. |
| Formulários não abrem | Atualize o navegador (o sistema usa o elemento `<dialog>`). |

---

## Fases do projeto

1. **Pesquisa de campo:** entrevistas com 2 profissionais da área (resumo no relatório final em PDF).
2. **Requisitos e prototipagem:** protótipos de baixa e alta fidelidade no Figma.
3. **MVP e validação:** fluxo principal funcional (pedidos → produção → estoque).
4. **Engenharia e publicação:** código versionado neste repositório e execução local.

---

## Limitações e próximos passos

Esta versão executa no navegador e persiste dados no `localStorage`. Portanto:

- os dados não são compartilhados entre dispositivos ou usuários;
- os pedidos são cadastrados manualmente (sem integração automática com apps de delivery);
- não há autenticação.

**Evolução planejada:** API REST (Node.js/Express) com banco relacional (SQLite/PostgreSQL), autenticação, integração com canais de delivery, estimativa de tempo de preparo e lista de insumos por pedido.

---

## Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE`.
