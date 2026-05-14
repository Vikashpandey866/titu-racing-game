const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let speed = 8;
let gameRunning = false;
let weather = "sunny";

const player = {
  x: canvas.width / 2 - 35,
  y: canvas.height - 140,
  width: 70,
  height: 120,
  color: "red",
  nitro: false
};

let keys = {};

const trafficCars = [];

for (let i = 0; i < 5; i++) {
  trafficCars.push({
    x: 150 + Math.random() * (canvas.width - 300),
    y: -i * 300,
    width: 70,
    height: 120,
    color: "white"
  });
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "Shift") {
    player.nitro = true;
    speed = 16;
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;

  if (e.key === "Shift") {
    player.nitro = false;
    speed = 8;
  }
});

function startGame() {
  document.getElementById("menu").style.display = "none";

  player.color = document.getElementById("carSelect").value;
  weather = document.getElementById("weatherSelect").value;

  gameRunning = true;
  update();
}

function drawRoad() {
  ctx.fillStyle = "#333";
  ctx.fillRect(120, 0, canvas.width - 240, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;

  for (let i = 0; i < canvas.height; i += 60) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, i + (score % 60));
    ctx.lineTo(canvas.width / 2, i + 30 + (score % 60));
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "black";
  ctx.fillRect(player.x + 10, player.y + 20, 15, 30);
  ctx.fillRect(player.x + 45, player.y + 20, 15, 30);

  if (player.nitro) {
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x + 25, player.y + 120, 20, 30);
  }
}

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 130)
    player.x -= speed;

  if (keys["ArrowRight"] && player.x < canvas.width - 200)
    player.x += speed;

  if (keys["ArrowUp"])
    score += 2;
}

function drawTraffic() {
  trafficCars.forEach(car => {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);

    car.y += speed;

    if (car.y > canvas.height) {
      car.y = -200;
      car.x = 150 + Math.random() * (canvas.width - 300);
      score += 10;
    }

    if (
      player.x < car.x + car.width &&
      player.x + player.width > car.x &&
      player.y < car.y + car.height &&
      player.y + player.height > car.y
    ) {
      gameOver();
    }
  });
}

function drawWeather() {
  if (weather === "night") {
    ctx.fillStyle = "rgba(0,0,50,0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (weather === "rain") {
    ctx.strokeStyle = "lightblue";

    for (let i = 0; i < 120; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 5, y + 15);
      ctx.stroke();
    }
  }
}

function updateHUD() {
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("speed").innerText = "Speed: " + speed;
}

function gameOver() {
  alert("Game Over! Score: " + score);
  location.reload();
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoad();
  movePlayer();
  drawPlayer();
  drawTraffic();
  drawWeather();
  updateHUD();

  requestAnimationFrame(update);
}
