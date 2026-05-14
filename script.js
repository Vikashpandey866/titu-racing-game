# Realistic Arcade Racing Upgrade 🚗🔥

## Replace Your `script.js` With This

```javascript
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none";
  }, 2000);
});

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87ceeb, 20, 120);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

let gameStarted = false;
let moveLeft = false;
let moveRight = false;
let nitro = false;
let selectedCar = "red";
let speed = 0.7;
let score = 0;

const textureLoader = new THREE.TextureLoader();

function getCarTexture(color){
  return textureLoader.load(`${color}-car.png`);
}

/* ========================= */
/* LIGHTING */
/* ========================= */

const hemiLight = new THREE.HemisphereLight(
  0xffffff,
  0x444444,
  1.2
);
scene.add(hemiLight);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(20,30,10);
sun.castShadow = true;
scene.add(sun);

/* ========================= */
/* SKY */
/* ========================= */

scene.background = new THREE.Color(0x87ceeb);

/* ========================= */
/* GROUND */
/* ========================= */

const grassGeometry = new THREE.PlaneGeometry(500,500);
const grassMaterial = new THREE.MeshLambertMaterial({
  color:0x2f7d32
});

const grass = new THREE.Mesh(
  grassGeometry,
  grassMaterial
);

grass.rotation.x = -Math.PI/2;
grass.position.y = -0.2;
scene.add(grass);

/* ========================= */
/* ROAD */
/* ========================= */

const roadGeometry = new THREE.PlaneGeometry(18,400);

const roadMaterial = new THREE.MeshPhongMaterial({
  color:0x1f1f1f
});

const road = new THREE.Mesh(
  roadGeometry,
  roadMaterial
);

road.rotation.x = -Math.PI/2;
road.receiveShadow = true;
scene.add(road);

/* ========================= */
/* ROAD LINES */
/* ========================= */

const roadLines = [];

for(let i=0;i<25;i++){

  const geo = new THREE.BoxGeometry(0.3,0.1,5);

  const mat = new THREE.MeshBasicMaterial({
    color:0xffffff
  });

  const line = new THREE.Mesh(geo,mat);

  line.position.set(0,0.05,-i*18);

  scene.add(line);

  roadLines.push(line);

}

/* ========================= */
/* PLAYER CAR */
/* ========================= */

const playerMaterial = new THREE.SpriteMaterial({
  map:getCarTexture(selectedCar),
  transparent:true
});

const playerCar = new THREE.Sprite(playerMaterial);

playerCar.scale.set(2.8,5,1);
playerCar.position.set(0,1,8);

scene.add(playerCar);

/* ========================= */
/* CAMERA */
/* ========================= */

camera.position.set(0,14,10);
camera.lookAt(playerCar.position);

/* ========================= */
/* TRAFFIC */
/* ========================= */

const trafficCars = [];

function createTrafficCar(zPos){

  const colors = [
    "red",
    "blue",
    "green"
  ];

  const randomColor =
    colors[Math.floor(Math.random()*3)];

  const material = new THREE.SpriteMaterial({
    map:getCarTexture(randomColor),
    transparent:true
  });

  const car = new THREE.Sprite(material);

  car.scale.set(2.8,5,1);

  const lanes = [-5,0,5];

  car.position.set(
    lanes[Math.floor(Math.random()*3)],
    1,
    zPos
  );

  scene.add(car);
  trafficCars.push(car);

}

for(let i=0;i<10;i++){
  createTrafficCar(-80 - i*30);
}

/* ========================= */
/* CONTROLS */
/* ========================= */

window.addEventListener("keydown",(e)=>{

  if(e.key === "ArrowLeft"){
    moveLeft = true;
  }

  if(e.key === "ArrowRight"){
    moveRight = true;
  }

  if(e.key === "Shift"){
    nitro = true;
  }

});

window.addEventListener("keyup",(e)=>{

  if(e.key === "ArrowLeft"){
    moveLeft = false;
  }

  if(e.key === "ArrowRight"){
    moveRight = false;
  }

  if(e.key === "Shift"){
    nitro = false;
  }

});

/* ========================= */
/* GARAGE */
/* ========================= */

function selectCar(color){

  selectedCar = color;

  playerCar.material.map =
    getCarTexture(color);

  playerCar.material.needsUpdate = true;

}

function startGame(){

  gameStarted = true;

  document.getElementById(
    "garageMenu"
  ).style.display = "none";

}

/* ========================= */
/* GAME FUNCTIONS */
/* ========================= */

function movePlayer(){

  speed = nitro ? 1.5 : 0.8;

  if(moveLeft){
    playerCar.position.x -= 0.25;
  }

  if(moveRight){
    playerCar.position.x += 0.25;
  }

  if(playerCar.position.x < -6){
    playerCar.position.x = -6;
  }

  if(playerCar.position.x > 6){
    playerCar.position.x = 6;
  }

}

function moveRoad(){

  roadLines.forEach(line=>{

    line.position.z += speed;

    if(line.position.z > 20){
      line.position.z = -350;
    }

  });

}

function moveTraffic(){

  trafficCars.forEach(car=>{

    car.position.z += speed;

    if(car.position.z > 20){

      const lanes = [-5,0,5];

      car.position.z = -300;

      car.position.x =
        lanes[Math.floor(Math.random()*3)];

      score += 10;

    }

    if(
      Math.abs(playerCar.position.x - car.position.x) < 1.5
      &&
      Math.abs(playerCar.position.z - car.position.z) < 2
    ){

      alert(`💥 Crash!\nScore: ${score}`);

      location.reload();

    }

  });

}

function updateHUD(){

  document.getElementById("score").innerText = score;

  document.getElementById("speed").innerText =
    nitro ? "BOOST ⚡" : "NORMAL";

  document.getElementById("nitroStatus").innerText =
    nitro ? "ON" : "OFF";

}

/* ========================= */
/* CAMERA FOLLOW */
/* ========================= */

function updateCamera(){

  camera.position.x =
    playerCar.position.x * 0.3;

  camera.lookAt(playerCar.position);

}

/* ========================= */
/* ANIMATE */
/* ========================= */

function animate(){

  requestAnimationFrame(animate);

  if(gameStarted){

    movePlayer();

    moveRoad();

    moveTraffic();

    updateHUD();

    updateCamera();

  }

  renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

});
```

## Result After Upgrade 😎🔥

* Better camera
* Real lane system
* Better road feel
* Smaller realistic cars
* Camera fo
