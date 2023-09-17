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

loader.load('./Models/scene1.gltf' , (gltf) => {
  console.log(gltf);
  scene.add(gltf.scene);
  const light1 = gltf.scene.getObjectByName("Point");
  const light2 = gltf.scene.getObjectByName("Point001");
  const light3 = gltf.scene.getObjectByName("Point002");
  light1.intensity = 3.0; light1.distance = 40; light1.decay = 2.0; //blue
  light2.intensity = 2.0; light2.distance = 10; light2.decay = 2.0; //orange
  light3.intensity = 1; light3.distance = 50; light3.decay = 2.0; //purple

  const Char = gltf.scene.getObjectByName("ToonChar");
  Char.frustumCulled = false;
  Char.material.map.minFilter = THREE.NearestFilter;
  Char.material.map.magFilter = THREE.NearestFilter;

  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(l){console.log(l);});
    var action0 = mixer.clipAction(gltf.animations[0]);action0.clampWhenFinished = true ;action0.setLoop(THREE.LoopOnce);action0.play(); //main char
    var action1 = mixer.clipAction(gltf.animations[1]);action1.clampWhenFinished = true ;action1.setLoop(THREE.LoopOnce);action1.play(); //main char mouth
    var action2 = mixer.clipAction(gltf.animations[2]);action2.clampWhenFinished = true ;action2.setLoop(THREE.LoopRepeat);action2.play(); //unity
    var action3 = mixer.clipAction(gltf.animations[3]);action3.clampWhenFinished = false;action3.setLoop(THREE.LoopRepeat);action3.play(); //blender
    var action4 = mixer.clipAction(gltf.animations[4]);action4.clampWhenFinished = true ;action4.setLoop(THREE.LoopOnce);action4.play(); //laptop
    var action5 = mixer.clipAction(gltf.animations[5]);action5.clampWhenFinished = true ;action5.setLoop(THREE.LoopOnce);action5.play(); //screen
    camAnimation = mixer.clipAction(gltf.animations[6]);camAnimation.clampWhenFinished = true ;camAnimation.setLoop(THREE.LoopOnce);//camAnimation.play(); //camera
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
new RGBELoader(manager).load('./images/hdrs/N_Galactic4k_C.hdr', function (texture) {
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
    if (intersects[i].object.name === "objectName") {
      console.log("You've clicked on object with name 'objectName'");
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

function playAll(){
  mixer._actions.forEach((action) => {
    if(action != mixer._actions[6]){action.reset().play();}
  });
}

var theValue = 0;
var winSize = false;
var camSwitch = false;
var playanim = false;
// event listener for mouse click
window.addEventListener('click', onMouseClick, false);

document.getElementById('HideContent').addEventListener('click', function(){
  var con = document.getElementById('main-content');
  if(con.style.display === "none"){con.style.display = "block"; console.log("changed to block")}
  else {con.style.display = "none"; console.log("changed to none")}
});

document.getElementById('Backto').addEventListener('click', function(){window.location.href = "./index.html";});
document.getElementById('next').addEventListener('click', function(){theValue = 1});
document.getElementById('last').addEventListener('click', function(){theValue = -1});
document.getElementById('replayAnimations').addEventListener('click', function(){playanim = true});

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
  if(playanim === true){ 
    playanim = false;
    playAll();
  }
  var delta = clock.getDelta();
  
  if (mixer) { mixer.update(delta); }
  controls.update();
  if(Cam){ Cam.updateProjectionMatrix(); }
  if(winSize === true){
    const width = window.innerWidth;
    const height = window.innerHeight;
    if(width <= 768){Cam.fov = 70}else {Cam.fov = 50}
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