import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

var mixer;
var clock = new THREE.Clock();



var Cam;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
let camAnimation;
var curentframe = 0;
const manager = new THREE.LoadingManager();

manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function () {
  console.log('Loading complete!');
  const loadingScreen = document.getElementById('Loading-Screen');
  loadingScreen.style.display = 'none';
};

const loader = new GLTFLoader(manager);
const loader2 = new RGBELoader(manager);





loader.load('./Models/mainMenue.gltf' , (gltf) => {
  console.log(gltf);
  scene.add(gltf.scene);

  const Char = gltf.scene.getObjectByName("ToonChar");
  Char.frustumCulled = false;
  Char.material.map.minFilter = THREE.NearestFilter;
  Char.material.map.magFilter = THREE.NearestFilter;

  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(l){console.log(l);});
    console.log(gltf.scene.getObjectByName("CharBox"));

    const charbox = gltf.scene.getObjectByName("CharBox");
    
    charbox.material.transparent = true;
    charbox.material.opacity = 0;

    camAnimation = mixer.clipAction(gltf.animations[0]);camAnimation.clampWhenFinished = true ;camAnimation.setLoop(THREE.LoopOnce);//camAnimation.play(); //camera

    var settingpose = mixer.clipAction(gltf.animations[1]);
    settingpose.clampWhenFinished = true ;
    settingpose.setLoop(THREE.LoopOnce); 
    settingpose.play();
  }
  if (gltf.cameras && gltf.cameras.length > 0) {
    Cam = gltf.cameras[0];
    Cam.fov = 70; Cam.focus = 30.0;
    Cam.filmGauge = 50;
  }
  document.getElementById("tab").disabled = false;
});
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

new RGBELoader(manager).load('./images/hdrs/justSKY.hdr', function (texture) {
  var envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.background = envMap;
  scene.environment = envMap;
});
var pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, Cam);
  let intersects = raycaster.intersectObjects(scene.children);
  console.log("You've clicked on object with name " + intersects[0].object.name );
  for (let i = 0; i < intersects.length; i++) {

    if (intersects[i].object.name === "CharBox") {
      window.location.href = "./self.html";
      console.log("You've clicked on object with name 'objectName'");
    }
    if(intersects[i].object.name === "EgyptPannel"){
      console.log("You've clicked desert" );
      window.location.href = "./Rs_desert.html";
    }
  }
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update camera aspect ratio
  Cam.aspect = width / height;
  Cam.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(width, height);
}


let pauseTimeout;
function animateForward(){
  if(camAnimation && camAnimation.timeScale !== undefined){
    camAnimation.timeScale = 1;
    clearTimeout(pauseTimeout);
    camAnimation.paused = false;
    camAnimation.play();
    pauseTimeout = setTimeout(() => {
      camAnimation.paused = true;
    }, 1000 * curentframe);
  }
  console.log("going forawrds " + curentframe);
  theValue = 0;
}

function animateBackward(){
  if(camAnimation && camAnimation.timeScale !== undefined){
    camAnimation.timeScale = -1;
    clearTimeout(pauseTimeout);
    camAnimation.paused = false;
    camAnimation.play();
    pauseTimeout = setTimeout(() => {
      camAnimation.paused = true;
    }, 1000);
  }console.log("going Backwards ");
  theValue = 0;
}

var theValue = 0;
var winSize = false;
var camSwitch = false;

// event listener for mouse click
window.addEventListener('click', onMouseClick, false);
document.getElementById('next').addEventListener('click', function(){theValue = 1});
document.getElementById('last').addEventListener('click', function(){theValue = -1});


document.getElementById('CamChanger').addEventListener('click', function(){ if(camSwitch === true){camSwitch = false} else {camSwitch = true}});

window.addEventListener('resize', function(){winSize = true}, false);

const controls = new OrbitControls(camera, renderer.domElement);

function animate(){
  requestAnimationFrame( animate );
  
  if(theValue == 1){
    if(curentframe <= 2)curentframe++;
    animateForward();
    console.log(curentframe);
    
  }else if(theValue == -1){
    if(curentframe > 0){curentframe--;}
    
    animateBackward();
  }
  var delta = clock.getDelta();
  
  if (mixer) { mixer.update(delta); }

  controls.update();

  if(Cam){ Cam.updateProjectionMatrix(); }

  if(winSize === true){
    const width = window.innerWidth;
    const height = window.innerHeight;
    // if(width <= 768){Cam.fov = 70}else {Cam.fov = 50}
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    Cam.aspect = width / height;
    Cam.updateProjectionMatrix();
    renderer.setSize(width, height);
    winSize = false;
  }
  if(camSwitch === false){
    renderer.render(scene, Cam);
  } else if( camSwitch === true){
    renderer.render(scene, camera);
  }
  
}
animate()