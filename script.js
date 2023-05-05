//Referências Iniciais
let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = [
  "Bélgica",
  "Butão",
  "Brasil",
  "China",
  "Cuba",
  "Equador",
  "Geórgia",
  "Alemanha",
  "hong-kong",
  "Índia",
  "irã",
  "Myanmar",
  "Noruega",
  "Espanha",
  "sri-lanka",
  "Suécia",
  "Suíça",
  "Estados Unidos",
  "Uruguai",
  "País de Gales",
];

let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

//Detectar dispositivo de toque
const isTouchDevice = () => {
  try {
    // Tentei  criar Touch Event (Ele vai falhar para desktops e lançaria erro)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

// Valor aleatório da matriz
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};

// Exibição do jogo ganhou
const stopGame = () => {
  controls.classList.remove("hide");
  startButton.classList.remove("hide");
};

//Arrastar & Soltar funções
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    // Aqui vai começar o movimento pelo touch
    moveElement = true;
    currentElement = e.target;
  } else {
    // Para dispositivos sem toque, defina os dados a serem transferidos
    e.dataTransfer.setData("text", e.target.id);
  }
}

// Eventos disparados no alvo de queda
function dragOver(e) {
  e.preventDefault();
}

//Para movimento na tela
const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY - newY;
  }
};

const drop = (e) => {
  e.preventDefault();
  //P ara tela sensível ao toque
  if (isTouchDevice()) {
    moveElement = false;
    //Selecione div do nome do país usando o atributo personalizado
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    //Obter limites de div
    const currentDropBound = currentDrop.getBoundingClientRect();
    //se a posição da bandeira estiver dentro dos limites do nome 
    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      //ocultar imagem real
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      //Colocar novo elemento de img
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "${currentElement.id}.png">`
      );
      count += 1;
    }
  } else {
    //Acessar dados
    const draggedElementData = e.dataTransfer.getData("text");
    //Obter valor de atributo personalizado
    const droppableElementData = e.target.getAttribute("data-id");
    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      //Classe abandonada
      e.target.classList.add("dropped");
      //ocultar img atual
      draggedElement.classList.add("hide");
      //arrastável definido como false
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      //colocar nova img
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="${draggedElementData}.png">`
      );
      count += 1;
    }
  }
  //ganhou
  if (count == 3) {
    result.innerText = `Você Ganhou!`;
    stopGame();
  }
};

//Cria bandeiras e países
const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];
  //para valores aleatórios de cadeia de caracteres na matriz
  for (let i = 1; i <= 3; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      //Se o valor já existe, então decremento i por 1
      i -= 1;
    }
  }
  for (let i of randomData) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
    dragContainer.appendChild(flagDiv);
  }
  //Classificar a matriz aleatoriamente antes de criar divs de país
  randomData = randomData.sort(() => 0.5 - Math.random());
  for (let i of randomData) {
    const countryDiv = document.createElement("div");
    countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
    ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>
    `;
    dropContainer.appendChild(countryDiv);
  }
};

//Começar game
startButton.addEventListener(
  "click",
  (startGame = async () => {
    currentElement = "";
    controls.classList.add("hide");
    startButton.classList.add("hide");
    //Isso aguardará que o criador crie as imagens e, em seguida, avance
    await creator();
    count = 0;
    dropPoints = document.querySelectorAll(".countries");
    draggableObjects = document.querySelectorAll(".draggable-image");

    //eventos
    draggableObjects.forEach((element) => {
      element.addEventListener("dragstart", dragStart);
      //para touch
      element.addEventListener("touchstart", dragStart);
      element.addEventListener("touchend", drop);
      element.addEventListener("touchmove", touchMove);
    });
    dropPoints.forEach((element) => {
      element.addEventListener("dragover", dragOver);
      element.addEventListener("drop", drop);
    });
  })
);
