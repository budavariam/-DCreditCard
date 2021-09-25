// IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/MTLLoader.js";

//SCENE
const scene = new THREE.Scene();

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setClearColor(0x131313);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth / 2, window.innerHeight);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.z = 100;

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 3;

//LIGHTS
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 30, 20);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 70;
scene.add(spotLight);
const spotLight2 = new THREE.SpotLight(0xffffff);
spotLight2.position.set(0, 30, -20);
spotLight2.castShadow = true;
spotLight2.shadow.mapSize.width = 1024;
spotLight2.shadow.mapSize.height = 1024;
spotLight2.shadow.camera.near = 500;
spotLight2.shadow.camera.far = 4000;
spotLight2.shadow.camera.fov = 70;
scene.add(spotLight2);

// OBJECT
const loader = new OBJLoader();
const mtlLoader = new MTLLoader();
let card;
mtlLoader.load("./card.mtl", (materials) => {
  materials.preload();
  loader.setMaterials(materials);
  loader.load("./card.obj", (object) => {
    card = object;
    card.rotateX(Math.PI / 2);
    card.scale.set(13, 13, 13);
    scene.add(card);
  });
});

const floader = new THREE.FontLoader();
const ID = {
  NAME: "NAME",
  CVV: "CVV",
  CARDNUM: "CARDNUM",
  EXP: "EXP",
}
let EDITABLE = {};

const createText = (id, text, [x, y, z], isRotated) => {
  if (EDITABLE[id]) {
    scene.remove(EDITABLE[id]);
  }
  floader.load("./font.json", function (font) {
    const geometry2 = new THREE.TextGeometry(text, {
      font: font,
      size: 3,
      height: 0.5,
      curveSegments: 21,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 10,
    });
    const materials2 = new THREE.MeshBasicMaterial({ color: 0xfafafa });
    const mesh = new THREE.Mesh(geometry2, materials2);
    mesh.position.set(x, y, z);
    if (isRotated) {
      mesh.rotateY(Math.PI);
    }
    EDITABLE[id] = mesh;
    scene.add(EDITABLE[id]);
  });
}

const createName = (text = "YOUR NAME HERE") => createText(ID.NAME, text, [-30, -15, 1]);
const createCardNum = (text = "1234-5678-9100-0000") => createText(ID.CARDNUM, text, [-30, -5, 1]);
const createExp = (text = "21/12") => createText(ID.EXP, text, [15, -15, 1]);
const createCvv = (text = "000") => createText(ID.CVV, text, [-15, -15, -1], true);

createName();
createCardNum();
createExp();
createCvv();

//RENDER LOOP
requestAnimationFrame(render);
function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

// Event Listeners
document.getElementById("name").addEventListener("keyup", (e) => {
  // Change Card Name Model
  createName(e.target.value);
});

document.getElementById("number").addEventListener("keyup", (e) => {
  // Change Card number Model
  createCardNum(e.target.value);
});

document.getElementById("expiration").addEventListener("keyup", (e) => {
  // Change Card Expiration Model
  createExp(e.target.value);
});

document.getElementById("cvv").addEventListener("keyup", (e) => {
  // Change Card Expiration Model
  createCvv(e.target.value);
});
