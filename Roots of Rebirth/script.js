/* ================================
   CONFIGURAÇÕES
================================ */
document.getElementById("btnJogar").addEventListener("click", () => {
    document.getElementById("telaInicial").style.display = "none";
    iniciarJogo(); // se quiser rodar alguma função ao iniciar
});
 
 
const player = document.getElementById("player");
const npcBubble = document.getElementById("npcBubble");
const quizBox = document.getElementById("quizOptions");
const map = document.getElementById("map");
 
let x = 200, y = 200;
const speed = 6;
 
let lastDirection = "down";
let dialogActive = false;
let quizAtivo = false;
let acessoMapa2 = false;
let currentMap = 1;
 
/* ================================
   HITBOX
================================ */
 
const playerHitbox = {
    width: 160,
    height: 180,
    offsetX: 10,
    offsetY: 20
};
 
/* ================================
   SPRITES
================================ */
 
const walkSprites = {
    up: ["sprites/up1.png","sprites/up2.png","sprites/up3.png","sprites/up2.png"],
    down: ["sprites/down1.png","sprites/down2.png","sprites/down3.png","sprites/down2.png"],
    left: ["sprites/left1.png","sprites/left2.png","sprites/left3.png","sprites/left2.png"],
    right: ["sprites/right1.png","sprites/right2.png","sprites/right3.png","sprites/right2.png"]
};
 
const idleSprites = {
    up: "sprites/up0.png",
    down: "sprites/down0.png",
    left: "sprites/left0.png",
    right: "sprites/right0.png"
};
 
let frame = 0;
let lastFrameTime = 0;
const spriteInterval = 150;
 
/* ================================
   ANIMAÇÃO DO PLAYER
================================ */
 
function animate(direction) {
    const now = Date.now();
    if (now - lastFrameTime >= spriteInterval) {
        frame = (frame + 1) % 4;
        player.src = walkSprites[direction][frame];
        lastFrameTime = now;
        lastDirection = direction;
    }
}
 
/* ================================
   MOVIMENTO
================================ */
 
let keys = { up: false, down: false, left: false, right: false };
 
document.addEventListener("keydown", (e) => {
    if (dialogActive || quizAtivo) return;
 
    if (e.key === "w") keys.up = true;
    if (e.key === "s") keys.down = true;
    if (e.key === "a") keys.left = true;
    if (e.key === "d") keys.right = true;
});
 
document.addEventListener("keyup", (e) => {
    if (e.key === "w") keys.up = false;
    if (e.key === "s") keys.down = false;
    if (e.key === "a") keys.left = false;
    if (e.key === "d") keys.right = false;
 
    if (!keys.up && !keys.down && !keys.left && !keys.right) {
        player.src = idleSprites[lastDirection];
        frame = 0;
    }
});
 
/* ================================
   TUTORIAL
================================ */
 
let tutorialCount = 0;
let tutorialActive = true;
 
document.addEventListener("keydown", (e) => {
    if (!tutorialActive) return;
 
    if (["w","a","s","d"].includes(e.key.toLowerCase())) {
        tutorialCount++;
 
        if (tutorialCount >= 5) {
            const tut = document.getElementById("tutorial");
            if (tut) {
                tut.style.opacity = "0";
                setTimeout(() => {
                    tut.style.display = "none";
                }, 600);
            }
            tutorialActive = false;
        }
    }
});
 
/* ================================
   NPC
================================ */
 
const npc = {
    x: 1550,
    y: 570,
    width: 200,
    height: 200,
    hitboxWidth: 170,
    hitboxHeight: 200,
    sprite: "sprites/npc.png"
};
 
npc.element = document.createElement("img");
npc.element.src = npc.sprite;
npc.element.style.position = "absolute";
npc.element.style.width = npc.width + "px";
npc.element.style.height = npc.height + "px";
npc.element.style.left = npc.x + "px";
npc.element.style.top = npc.y + "px";
document.getElementById("game").appendChild(npc.element);
 
/* ================================
   BARREIRA DO MAPA 2
================================ */
 
const barreira = {
    x: 0,
    y: window.innerHeight - 60,
    width: window.innerWidth,
    height: 60,
    sprite: "sprites/vinhas.png"
};
 
barreira.element = document.createElement("img");
barreira.element.src = barreira.sprite;
barreira.element.style.position = "absolute";
barreira.element.style.left = barreira.x + "px";
barreira.element.style.top = barreira.y + "px";
barreira.element.style.width = barreira.width + "px";
barreira.element.style.height = barreira.height + "px";
barreira.element.style.zIndex = "20";
document.getElementById("game").appendChild(barreira.element);
 
 
const scoreHUD = document.createElement("div");
scoreHUD.style.position = "absolute";
scoreHUD.style.left = "12px";
scoreHUD.style.top = "12px";
scoreHUD.style.padding = "8px 12px";
scoreHUD.style.background = "white";
scoreHUD.style.border = "2px solid black";
scoreHUD.style.zIndex = "40";
scoreHUD.innerText = "Pontos: 0";
document.getElementById("game").appendChild(scoreHUD);
 
function updateHUD() {
    scoreHUD.innerText = "Pontos: " + pontos;
}
 
 
 
let dialog = [
    "Olá moço, seja muito bem vindo a natureza.",
    "Pelo menos era isso que eu queria dizer...",
    "Quero que responda essas perguntas gerais para definir um destino provável."
];
let dialogIndex = 0;
let canInteract = false;
 
function showDialog() {
    npcBubble.style.display = "block";
    npcBubble.innerText = dialog[dialogIndex];
    npcBubble.style.left = npc.x + "px";
    npcBubble.style.top = npc.y - 40 + "px";
}
 
document.addEventListener("keydown", (e) => {
    if (e.key !== "j") return;
    if (!canInteract || currentMap !== 1) return;
 
    if (!dialogActive) {
        dialogActive = true;
        dialogIndex = 0;
        showDialog();
        return;
    }
 
    dialogIndex++;
 
    if (dialogIndex < dialog.length) {
        showDialog();
    } else {
        npcBubble.style.display = "none";
        dialogActive = false;
        iniciarQuiz();
    }
});
 
 
 
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
 
const quiz = [
    {
        pergunta: "Por que é importante economizar água no dia a dia?",
        opcoes: [
            "Porque a água tratada consome energia e recursos",
            "Porque a água pode desaparecer totalmente do planeta",
            "Porque economizar aumenta a pressão nos canos",
            "Porque a água usada volta totalmente limpa para os rios"
        ],
        correta: 0
    },
 
    {
        pergunta: "Qual atitude ajuda a reduzir o lixo produzido em casa?",
        opcoes: [
            "Evitar produtos com excesso de embalagens",
            "Comprar itens descartáveis sempre",
            "Queimar o lixo no quintal",
            "Jogar tudo no mesmo saco"
        ],
        correta: 0
    },
 
    {
        pergunta: "O que significa reciclar?",
        opcoes: [
            "Transformar materiais usados em novos produtos",
            "Guardar lixo em casa para não poluir",
            "Enterrar resíduos no solo",
            "Separar apenas lixo orgânico"
        ],
        correta: 0
    },
 
    {
        pergunta: "Qual prática reduz a poluição do ar nas cidades?",
        opcoes: [
            "Usar transporte coletivo",
            "Lavar calçadas com mangueira",
            "Manter veículos velhos sem revisão",
            "Acender fogueiras urbanas"
        ],
        correta: 0
    },
 
    {
        pergunta: "Por que plantar árvores é importante?",
        opcoes: [
            "Elas absorvem CO₂ e melhoram o ar",
            "Elas aquecem o clima",
            "Elas aumentam a quantidade de lixo",
            "Elas reduzem a umidade do solo"
        ],
        correta: 0
    },
 
    {
        pergunta: "O que pode causar a morte de peixes em rios?",
        opcoes: [
            "Despejo de esgoto e produtos químicos",
            "A presença de plantas aquáticas",
            "A água estar fria",
            "A presença de pedras no leito do rio"
        ],
        correta: 0
    },
 
    {
        pergunta: "O que significa reutilizar?",
        opcoes: [
            "Usar um objeto mais de uma vez ou para outra função",
            "Quebrar objetos velhos",
            "Transformar lixo em gás",
            "Comprar sempre produtos novos"
        ],
        correta: 0
    },
 
    {
        pergunta: "Por que o plástico é um problema para o meio ambiente?",
        opcoes: [
            "Demora muito para se decompor",
            "Não pode ser visto a olho nu",
            "Evapora facilmente",
            "É rapidamente absorvido pelo solo"
        ],
        correta: 0
    },
 
    {
        pergunta: "Qual atitude ajuda a proteger os animais?",
        opcoes: [
            "Preservar o habitat natural deles",
            "Retirar todos da floresta para segurança",
            "Aumentar o barulho nas áreas verdes",
            "Desmatar para criar fazendas"
        ],
        correta: 0
    },
 
    {
        pergunta: "Qual é um exemplo de energia renovável?",
        opcoes: [
            "Energia solar",
            "Carvão mineral",
            "Petróleo",
            "Gás natural"
        ],
        correta: 0
    }
];
   
 
let perguntaAtual = 0;
let pontos = 0;
 
function iniciarQuiz() {
    quizAtivo = true;
    perguntaAtual = 0;
    pontos = 0;
    updateHUD();
    mostrarPergunta();
}
 
function mostrarPergunta() {
    quizBox.innerHTML = "";
    quizBox.style.display = "flex";
 
    const q = quiz[perguntaAtual];
 
    const titulo = document.createElement("div");
    titulo.innerText = q.pergunta;
    titulo.style.fontSize = "26px";
    titulo.style.marginBottom = "10px";
    quizBox.appendChild(titulo);
 
    let opcoesMisturadas = q.opcoes.map((texto, index) => ({
        texto,
        indexOriginal: index
    }));
 
    shuffleArray(opcoesMisturadas);
 
    opcoesMisturadas.forEach((item) => {
        const btn = document.createElement("button");
        btn.className = "quizOption";
        btn.innerText = item.texto;
 
        btn.addEventListener("click", () => selecionarOpcao(item.indexOriginal, btn));
 
        quizBox.appendChild(btn);
    });
}
 
function selecionarOpcao(opcao, botao) {
    const correta = quiz[perguntaAtual].correta;
 
    if (opcao === correta) {
        pontos += 100;
        botao.style.background = "limegreen";
    } else {
        pontos -= 50;
        if (pontos < 0) pontos = 0;
        botao.style.background = "red";
    }
 
    updateHUD();
 
    setTimeout(() => {
        botao.style.background = "white";
        perguntaAtual++;
 
        if (perguntaAtual < quiz.length) mostrarPergunta();
        else finalizarQuiz();
 
    }, 400);
}
 
/* ================================
   FINALIZAR QUIZ (SEM PAINEL)
================================ */
 
let imagemMostrada = false;
 
function finalizarQuiz() {
    quizAtivo = false;
    quizBox.style.display = "none";
 
    acessoMapa2 = true;
    barreira.element.style.display = "none";
}
 
/* ================================
   COLISÃO
================================ */
 
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    );
}
 
/* ================================
   IMAGEM FINAL AO CHEGAR NO FIM DO MAPA 2
================================ */
 
function mostrarImagemFinal() {
    if (imagemMostrada) return;
    imagemMostrada = true;
 
    const resultado = document.createElement("div");
    resultado.style.position = "absolute";
    resultado.style.top = "50%";
    resultado.style.left = "50%";
    resultado.style.transform = "translate(-50%, -50%)";
    resultado.style.padding = "10px";
    resultado.style.background = "white";
    resultado.style.border = "4px solid black";
    resultado.style.borderRadius = "12px";
    resultado.style.zIndex = "200";
 
    const img = document.createElement("img");
    img.style.width = "480px";
    img.style.height = "320px";
    img.style.objectFit = "cover";
 
    if (pontos <= 300) img.src = "sprites/final1.gif";
    else if (pontos <= 600) img.src = "sprites/final2.gif";
    else img.src = "sprites/final3.gif";
 
    resultado.appendChild(img);
    document.body.appendChild(resultado);
}
 
/* ================================
   LOOP DO JOGO
================================ */
 
function gameLoop() {
    let nextX = x;
    let nextY = y;
 
    if (keys.up) nextY -= speed, animate("up");
    if (keys.down) nextY += speed, animate("down");
    if (keys.left) nextX -= speed, animate("left");
    if (keys.right) nextX += speed, animate("right");
 
    if (!acessoMapa2 && currentMap === 1) {
        if (isColliding(nextX, nextY, playerHitbox.width, playerHitbox.height,
            barreira.x, barreira.y, barreira.width, barreira.height)) {
            nextY = y;
        }
    }
 
    if (acessoMapa2 && currentMap === 1 &&
        nextY + playerHitbox.height >= window.innerHeight) {
 
        currentMap = 2;
        map.src = "sprites/map02.png";
        nextY = 10;
 
        imagemMostrada = false;
    }
 
    if (currentMap === 2 && nextY <= 0) {
        currentMap = 1;
        map.src = "sprites/map01.png";
        nextY = window.innerHeight - playerHitbox.height - 10;
    }
 
    x = nextX;
    y = nextY;
 
    player.style.left = x + "px";
    player.style.top = y + "px";
 
    npc.element.style.display = (currentMap === 1) ? "block" : "none";
 
    canInteract = isColliding(
        x, y, playerHitbox.width, playerHitbox.height,
        npc.x, npc.y, npc.hitboxWidth, npc.hitboxHeight
    );
 
    if (currentMap === 2 &&
        y + playerHitbox.height >= window.innerHeight - 6) {
        mostrarImagemFinal();
    }
 
    requestAnimationFrame(gameLoop);
}
 
gameLoop();
 
 
 