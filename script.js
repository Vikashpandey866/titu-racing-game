/* ========================= */
/* LOADING SCREEN */
/* ========================= */

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none";
  }, 2000);
});

/* ========================= */
/* THREE JS SETUP */
/* ========================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);

/* ========================= */
/* VARIABLES */
/* ========================= */

let selectedCar = "red";
let moveLeft = false;
let moveRight = false;
let nitro = false;

let score = 0;
let speed = 0;

let weather = "sunny";
let gameMode = "traffic";

/* ========================= */
/* AUDIO */
/* ========================= */

const bgMusic =
  document.getElementById("bgMusic");

const nitroSound =
  document.getElementById("nitroSound");

const crashSound =
  document.getElementById("crashSound");

/* ========================= */
/* LIGHTS */
/* ========================= */

const ambientLight =
  new THREE.AmbientLight(0xffffff, 1);

scene.add(ambientLight);

const directionalLight =
  new THREE.DirectionalLight(0xffffff, 1);

directionalLight.position.set(5,10,7);

scene.add(directionalLight);

/* ========================= */
/* ROAD */
/* ========================= */

const roadGeometry =
  new THREE.PlaneGeometry(25, 300);

const roadMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x333333
  });

const road =
  new THREE.Mesh(
    roadGeometry,
    roadMaterial
  );

road.rotation.x = -Math.PI / 2;

scene.add(road);

/* ========================= */
/* ROAD LINES */
/* ========================= */

const roadLines = [];

for(let i=0; i<20; i++){

  const lineGeometry =
    new THREE.BoxGeometry(0.5,0.1,5);

  const lineMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

  const line =
    new THREE.Mesh(
      lineGeometry,
      lineMaterial
    );

  line.position.z = i * -15;

  scene.add(line);

  roadLines.push(line);
}

/* ========================= */
/* PLAYER CAR */
/* ========================= */

const textureLoader =
  new THREE.TextureLoader();

function getCarTexture(color){

  return textureLoader.load(
    `assets/cars/${color}-car.png`
  );
}

const carGeometry =
  new THREE.BoxGeometry(2,1,4);

const carMaterial =
  new THREE.MeshStandardMaterial({
    map:getCarTexture(selectedCar)
  });

const playerCar =
  new THREE.Mesh(
    carGeometry,
    carMaterial
  );

playerCar.position.y = 0.7;
playerCar.position.z = 12;

scene.add(playerCar);

/* ========================= */
/* CAMERA */
/* ========================= */

camera.position.set(0,6,18);

camera.lookAt(playerCar.position);

/* ========================= */
/* TRAFFIC CARS */
/* ========================= */

const trafficCars = [];

function createTrafficCar(zPos){

  const geometry =
    new THREE.BoxGeometry(2,1,4);

  const material =
    new THREE.MeshStandardMaterial({
      color:0xffffff
    });

  const car =
    new THREE.Mesh(
      geometry,
      material
    );

  car.position.set(
    Math.random()*10 - 5,
    0.7,
    zPos
  );

  scene.add(car);

  trafficCars.push(car);
}

for(let i=0; i<8; i++){
  createTrafficCar(-i*25);
}

/* ========================= */
/* WEATHER */
/* ========================= */

function updateWeather(){

  if(weather === "night"){

    scene.background =
      new THREE.Color(0x000022);

  }
  else if(weather === "rain"){

    scene.background =
      new THREE.Color(0x444444);

  }
  else{

    scene.background =
      new THREE.Color(0x87ceeb);

  }

}

/* ========================= */
/* GARAGE */
/* ========================= */

function selectCar(color){

  selectedCar = color;

  playerCar.material.map =
    getCarTexture(color);

  playerCar.material.needsUpdate = true;
}

/* ========================= */
/* START GAME */
/* ========================= */

function startGame(){

  document
    .getElementById("garageMenu")
    .style.display = "none";

  weather =
    document.getElementById(
      "weatherSelect"
    ).value;

  gameMode =
    document.getElementById(
      "gameMode"
    ).value;

  updateWeather();

  bgMusic.volume = 0.5;

  bgMusic.play();
}

/* ========================= */
/* KEYBOARD CONTROLS */
/* ========================= */

window.addEventListener(
  "keydown",
  (e)=>{

    if(e.key === "ArrowLeft"){
      moveLeft = true;
    }

    if(e.key === "ArrowRight"){
      moveRight = true;
    }

    if(e.key === "Shift"){
      nitro = true;

      nitroSound.play();
    }

  }
);

window.addEventListener(
  "keyup",
  (e)=>{

    if(e.key === "ArrowLeft"){
      moveLeft = false;
    }

    if(e.key === "ArrowRight"){
      moveRight = false;
    }

    if(e.key === "Shift"){
      nitro = false;
    }

  }
);

/* ========================= */
/* MOVE PLAYER */
/* ========================= */

function movePlayer(){

  speed = nitro ? 1.2 : 0.6;

  if(moveLeft){
    playerCar.position.x -= speed;
  }

  if(moveRight){
    playerCar.position.x += speed;
  }

  if(playerCar.position.x < -9){
    playerCar.position.x = -9;
  }

  if(playerCar.position.x > 9){
    playerCar.position.x = 9;
  }

}

/* ========================= */
/* MOVE ROAD */
/* ========================= */

function moveRoad(){

  roadLines.forEach(line=>{

    line.position.z += speed;

    if(line.position.z > 20){
      line.position.z = -280;
    }

  });

}

/* ========================= */
/* MOVE TRAFFIC */
/* ========================= */

function moveTraffic(){

  trafficCars.forEach(car=>{

    car.position.z += speed;

    if(car.position.z > 20){

      car.position.z = -200;

      car.position.x =
        Math.random()*10 - 5;

      score += 10;
    }

    /* COLLISION */

    if(
      Math.abs(
        playerCar.position.x -
        car.position.x
      ) < 1.8
      &&
      Math.abs(
        playerCar.position.z -
        car.position.z
      ) < 3
    ){

      crashSound.play();

      alert(
        "💥 Crash! Game Over\nScore: "
        + score
      );

      location.reload();

    }

  });

}

/* ========================= */
/* HUD */
/* ========================= */

function updateHUD(){

  document.getElementById(
    "score"
  ).innerText = score;

  document.getElementById(
    "speed"
  ).innerText =
    nitro ? "BOOST" : "NORMAL";

  document.getElementById(
    "nitroStatus"
  ).innerText =
    nitro ? "ON ⚡" : "OFF";

}

/* ========================= */
/* ANIMATION LOOP */
/* ========================= */

function animate(){

  requestAnimationFrame(animate);

  movePlayer();

  moveRoad();

  moveTraffic();

  updateHUD();

  renderer.render(scene, camera);

}

animate();

/* ========================= */
/* RESPONSIVE */
/* ========================= */

window.addEventListener(
  "resize",
  ()=>{

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);
