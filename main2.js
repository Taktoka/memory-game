let startScreen = document.querySelector(".start-screen");
let startBtn = document.querySelector(".start-screen span");
let input = document.querySelector(".start-screen input");
let score = document.querySelector(".score span");
let timer = document.querySelector(".timer ");
let timerspan = document.querySelector(".game-info .time");
let allMatchedArray = [];
let PlayersArray = [];
let duration = 1000;

if (localStorage.getItem("palyers")) {
  PlayersArray = JSON.parse(localStorage.getItem("palyers"));
}
getFromLocal();

startBtn.onclick = () => {
  if (input.value === "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = input.value;
  }
  document.getElementById("start").play();
  startScreen.style.display = "none";
  countDown(60);
};

function countDown(time) {
  countDownInterv = setInterval(() => {
    let minutes = parseInt(time / 60);
    let seconds = parseInt(time % 60);

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timerspan.innerHTML = `${minutes}<span>:</span>${seconds}`;

    if (--time < 0) {
      addPlayer(PlayersArray);
      timerspan.style.animation = "pause";
      document.querySelector(".time-up").style.display = "block";
      document.getElementById("fail").pause();
      document.getElementById("you-lose").play();
      clearInterval(countDownInterv);
    }
  }, duration);
}

let blocksArray = Array.from(
  document.querySelectorAll(".game-body .game-block")
);

let orderArray = [...Array(blocksArray.length).keys()];
shuffling(orderArray);

blocksArray.forEach((block, index) => {
  block.style.order = orderArray[index];

  block.addEventListener("click", () => {
    flippBlock(block);
  });
});
let container = document.querySelector(".game-body");

function flippBlock(block) {
  block.classList.add("flipped");

  let flippedArray = blocksArray.filter((block) =>
    block.classList.contains("flipped")
  );
  if (flippedArray.length === 2) {
    stopclicking();
    checkMatchedBlc(flippedArray[0], flippedArray[1]);
  }
}

function addPlayer(array) {
  let player = {
    id: input.value,
    score: score.innerHTML,
  };
  PlayersArray.push(player);
  createPlayer(PlayersArray);
  addToLocal(PlayersArray);
}

function createPlayer(array) {
  document.querySelector(".players").innerHTML = "";
  array.forEach((player) => {
    let div = document.createElement("div");
    div.className = "player";
    div.innerHTML = `Player : ${player.id}`;
    let playerScore = document.createElement("span");
    playerScore.className = "pscore";
    playerScore.innerHTML = `Score : ${player.score}`;
    div.appendChild(playerScore);
    document.querySelector(".players").appendChild(div);
  });
}

function addToLocal(array) {
  window.localStorage.setItem("players", JSON.stringify(array));
}
function getFromLocal() {
  let data = window.localStorage.getItem("players");

  if (data) {
    PlayersArray = JSON.parse(data);
  }
  createPlayer(PlayersArray);
}

function stopclicking() {
  container.classList.add("no-click");
  setTimeout(() => {
    container.classList.remove("no-click");
  }, duration);
}

function checkMatchedBlc(firstBlc, scndBlc) {
  if (firstBlc.dataset.block === scndBlc.dataset.block) {
    score.innerHTML = parseInt(score.innerHTML) + 5;

    firstBlc.classList.remove("flipped");
    scndBlc.classList.remove("flipped");

    firstBlc.classList.add("matched");
    scndBlc.classList.add("matched");
    document.getElementById("success").play();
    allMatchedArray.push(firstBlc, scndBlc);
    if (allMatchedArray.length === blocksArray.length) {
      addPlayer(PlayersArray);
      clearInterval(countDownInterv);
      document.querySelector(".time-up span").innerHTML = "You Won";
      document.querySelector(".time-up").style.display = "block";
      document.getElementById("success").pause();
      document.getElementById("done").play();
    }
  } else {
    setTimeout(() => {
      firstBlc.classList.remove("flipped");
      scndBlc.classList.remove("flipped");
    }, duration);
    document.getElementById("fail").play();
  }
}

function shuffling(array) {
  let current = array.length;
  let temp;
  let random;
  while (current > 0) {
    current--;
    random = Math.floor(Math.random() * current);
    array[current] = temp;
    array[current] = array[random];
    temp = array[random];
  }
  return array;
}
