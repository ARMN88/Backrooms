// Console //
eruda.init();

// Variables //
const keyboard = {};
const speed = 0.1;

const cells = [];

const chunkSize = 5;
const seperationSize = 5;

// Init Scene //
const scene = new THREE.Scene();
const color = 0x000000;
const density = 0.25;
scene.fog = new THREE.FogExp2(color, density);

// Init Camera //
const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 70);
camera.position.y = 2.5;

// Init Renderer //
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Post Processing //
const composer = new THREE.EffectComposer(renderer);

const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const filmPass = new THREE.FilmPass(
    0.4,   // noise intensity
    0.2,  // scanline intensity
    200,    // scanline count
    false,  // grayscale
);
filmPass.renderToScreen = true;
composer.addPass(filmPass);

// Lighting //
const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
light1.position.set(5, 4, 3);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
light2.position.set(-5, -4, -3);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Init Controls //
const controls = new THREE.PointerLockControls(camera, renderer.domElement);

function Start() {
  renderer.setAnimationLoop(Update);
}
cells.push(new Cell(0, 0, 1));
function Update() {
  Movement();
  for(let x = 0; x < chunkSize; x++) {
    for(let y = 0; y < chunkSize; y++) {
      let chunkPos = {
        x: Math.round(camera.position.x/seperationSize)*seperationSize+(x-Math.floor(chunkSize/2))*seperationSize,
        y: Math.round(camera.position.z/seperationSize)*seperationSize+(y-Math.floor(chunkSize/2))*seperationSize
      }
      if(!cells.some(cell => {return cell.x === chunkPos.x && cell.y === chunkPos.y})) {
        cells.push(new Cell(chunkPos.x, chunkPos.y, Math.floor(Math.random() * (Cell.tiles.length-1))));
      }
    }
  }
  for(let cell of cells) {
if(Distance(Math.round(camera.position.x/seperationSize)*seperationSize, Math.round(camera.position.z/seperationSize)*seperationSize, cell.x, cell.y) >= Math.round(chunkSize/2)*seperationSize) {
      cells.splice(cells.indexOf(cell), 1);
      continue;
    }
    if(cell.isUsed) {
      continue;
    }
    // Wave Function Collapse
    let avaliableTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for(let nearestCell of Cell.NearestCells(cell.x, cell.y)) {
      let direction = getDirection(cell.x, cell.y, nearestCell.x, nearestCell.y);
      avaliableTiles = avaliableTiles.filter(item => {
        return nearestCell.neighborLists[direction].includes(item);
      });
    }
    if(avaliableTiles.length === 0) {
      cell.imageIndex = 11;
    }else {
      cell.imageIndex = avaliableTiles[Math.floor(Math.random() * avaliableTiles.length)];
    }
    cell.isUsed = true;
    cell.addMesh();
  }
  for(let object of scene.children) {
    if(Distance(Math.round(camera.position.x/seperationSize)*seperationSize, Math.round(camera.position.z/seperationSize)*seperationSize, object.position.x, object.position.z) >= Math.ceil(chunkSize/2)*seperationSize && object.type === "Group") {
      scene.remove(object);
    }
  }
  composer.render();
  //renderer.render(scene, camera);
}

function Movement() {
  // W //
  if(keyboard[87]) {
    controls.moveForward(speed);
  }
  // S //
  if(keyboard[83]) {
    controls.moveForward(-speed);
  }
  // A //
  if(keyboard[65]) {
    controls.moveRight(-speed);
  }
  // D //
  if(keyboard[68]) {
    controls.moveRight(speed);
  }
  if(keyboard[69]) {
    camera.position.y += speed;
  }
}

function Distance(x1, y1, x2, y2) {
  return Math.sqrt(
    (x2-x1) ** 2 +
    (y2-y1) ** 2
  );
}

function getDirection(x1, y1, x2, y2) {
  let offset = {
    x: (x2-x1)/seperationSize,
    y: (y2-y1)/seperationSize
  }
  if(offset.x === 0 && offset.y === 1) {
    return "posY";
  }
  if(offset.x === 0 && offset.y === -1) {
    return "negY";
  }
  if(offset.x === 1 && offset.y === 0) {
    return "posX";
  }
  if(offset.x === -1 && offset.y === 0) {
    return "negX";
  }
}

window.onkeydown = e => {
  keyboard[e.keyCode] = true;
}

window.onkeyup = e => {
  delete keyboard[e.keyCode];
}

renderer.domElement.onclick = () => {
  controls.lock();
}

window.onload = Start;

javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
