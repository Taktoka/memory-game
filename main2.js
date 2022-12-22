let input = document.querySelector(".start-screen input");
let timer = document.querySelector(".timer ");
let timerspan = document.querySelector(".game-info .time");
let score = document.querySelector(".score span");
let pscore = document.querySelector(".player .pscore");
let PlayersArray = [];
let scoArray = [];
let duration = 1000;
let allMatchedArray = [];
let countDownInterv;

// get from local storage
checkzlocal();
getFromLocal();
// handle start screen

document.querySelector(".start-screen .start").onclick = () => {
  if (input.value === "") {
    document.querySelector(".name span ").innerHTML = "unknown";
  } else {
    document.querySelector(".name span ").innerHTML = input.value;
  }
  document.getElementById("start").play();
  document.querySelector(".start-screen").style.display = "none";
  countDown(60);
};

// count dpen function
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
      document.getElementById("you-lose").play();
      clearInterval(countDownInterv);
    }
  }, duration);
}
// blocks Array
let blocksArray = Array.from(
  document.querySelectorAll(".game-body .game-block")
);

// get order range array
let orderRangeArray = [...Array(blocksArray.length).keys()];
console.log(orderRangeArray);
// trigger shuffle fun
shuffling(orderRangeArray);
console.log(orderRangeArray); // new random array

// loop to add random order & handle clicking
blocksArray.forEach((block, index) => {
  // add order prop
  block.style.order = orderRangeArray[index];
  //    handle click event
  block.addEventListener("click", () => {
    // trigger flipping function
    flipping(block);
  });
});

// flipping function
function flipping(block) {
  block.classList.add("flipped");
  //   collect flipped blocks
  let flipedBlocks = blocksArray.filter((block) =>
    block.classList.contains("flipped")
  );
  //   check if theres two cards
  if (flipedBlocks.length === 2) {
    stopclicking();
    checkMatched(flipedBlocks[0], flipedBlocks[1]);
  }
}

let blocksContainer = document.querySelector(".game-body");
// stop clicking function
function stopclicking() {
  // add no click class
  blocksContainer.classList.add("no-click");
  // remove no click class

  setTimeout(() => {
    blocksContainer.classList.remove("no-click");
  }, duration);
}

// checked matched
function checkMatched(firstBlock, secondBlock) {
  // check if matched
  if (firstBlock.dataset.block === secondBlock.dataset.block) {
    score.innerHTML = parseInt(score.innerHTML) + 5;

    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");

    firstBlock.classList.add("matched");
    secondBlock.classList.add("matched");

    allMatchedArray.push(firstBlock, secondBlock);

    if (allMatchedArray.length === blocksArray.length) {
      addPlayer(PlayersArray);

      clearInterval(countDownInterv);
      document.querySelector(".time-up span").innerHTML = "You Won";
      document.querySelector(".time-up").style.display = "block";
      document.getElementById("done").play();
    }
    // play audio
    document.getElementById("success").play();
    // if not matched
  } else {
    setTimeout(() => {
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
    }, duration);
    document.getElementById("fail").play();
  }
}

// shuffle function to random blocks order
function shuffling(array) {
  // get current elment
  let current = array.length;
  let temp;
  let random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    // decrease current
    current--;
    // swapping
    // 1) save current in statsh
    array[current] = temp;
    // 2)current ele = random ele
    array[current] = array[random];
    // 3)get element from statsh
    temp = array[random];
  }
  return array;
}

function addPlayer() {
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

// add to local storage
function addToLocal(array) {
  window.localStorage.setItem("players", JSON.stringify(array));
}

// get from ocal func
function getFromLocal() {
  let data = window.localStorage.getItem("players");

  if (data) {
    PlayersArray = JSON.parse(data);
  }

  createPlayer(PlayersArray);
}

function checkzlocal() {
  if (window.localStorage.getItem("players")) {
    PlayersArray = JSON.parse(window.localStorage.getItem("players"));
  }
}
