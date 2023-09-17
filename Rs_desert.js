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

loader.load('./Models/Rs_dessert.gltf' , (gltf) => {
  console.log(gltf);
  scene.add(gltf.scene);

//   const Char = gltf.scene.getObjectByName("ToonChar");
//   Char.frustumCulled = false;
//   Char.material.map.minFilter = THREE.NearestFilter;
//   Char.material.map.magFilter = THREE.NearestFilter;
    var sun = gltf.scene.getObjectByName("Sun");
    sun.intensity = 1;

  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(l){console.log(l);});

    camAnimation = mixer.clipAction(gltf.animations[0]);camAnimation.clampWhenFinished = true ;camAnimation.setLoop(THREE.LoopOnce);//camAnimation.play(); //camera
  }
  if (gltf.cameras && gltf.cameras.length > 0) {
    Cam = gltf.cameras[0];
    Cam.fov = 50; Cam.focus = 30.0;
    Cam.filmGauge = 50;
  }
  document.getElementById("tab").disabled = false;
});
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

new RGBELoader(manager).load('./images/hdrs/desertSky.hdr', function (texture) {
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
    if (intersects[i].object.name === "SlaveMasterGrador"){
        document.querySelector(".Text-Container").innerHTML = `
        <p class="him"> Slave Master Grador </p>
        <p>Graardor is known for his strength and ruthlessness that could subdue anyone who disobeyed. 
        He is contemptuous with the position he has been given. Though he sees himself more as a tyrant and seeks to amass an army. To take part in Anubis great conquest.
        Anubis is the only person he would not raise his hand against. As he has seen the devastation that has been caused by his rage. Graardor praises this aspect of Anubis. He sees his god's will in him.
        </p>
        <div class='quoates'>
            <p>“I subdued all the ogres and giants of these sandy lands in my pursuit for Anubis. You punny imp, face more than you can handle. SCRAM”</p>
            <p>	“The look in your eyes is something. You will be a good addition to my chariot”</p>
            <p>“Struggle, rage, rampage.Show me what that feels like Once more.”</p>
            <p>“You have your entire life To slave for.It's honest work I'll tell you.”</p>
        </div>
        `;
    }
    if (intersects[i].object.name === "Judge_krearra"){
        document.querySelector(".Text-Container").innerHTML = `
        <p class="him"> Kree'arra </p>
        <p>Kree'arra roams the land of the Kharidian deserts with her fleet. Enforcing the law so that peace could thrive within the desert. She calms the lives of it's residents by giving them protection.
        Anubis respects Kree'arra for helping him to uphold his rule. 
        Kree'arra wishes to lift some of Anubis burdens. Since she sees all the good that has come to the desert because of its thriving king.
        </p>
        <div class='quoates'>
            <p>“The crime of War is lifted by the gods themselves. Even so, there are exceptions that even in the heart of war should be upheld.”</p>
            <p>“I Question my actions when faced with you. Why is that?”</p>
            <p>“Even tough Graardor was great for thoseing criminals at. I'am glad to witness his demise. ”</p>
            <p>“Your crimes would be forgiven by your province in war. Join us, redemption is my gift to you.”</p>
        </div>
        `;
    }
    if (intersects[i].object.name === "Egyptian_zilyana"){
        document.querySelector(".Text-Container").innerHTML = `
        <p class="him"> Zilyana </p>
        <p> She eventually confronted Anubis and his conquest to take Gielinor. This broke out into a fight, as rage took over anubis. The fight was  to the point that gods intervened. Saradomin 
        Blessed Zilyana with more power to no avail. as the magic spells Anubis had conjured overwhelmed her. Power alone wasn't enough.
        feelings for her husband got in the way. And she knew that she couldn't kill him.
        Had she continued. This battle could have ended in death for one of them. For now she leaves the throne to anubis. 
        </p>
        <div class='quoates'>
            <p>“His wrath and diligence scares even the gods. If Saradomin grace hadn't come in such haste, we wouldn't have known of the gods watchful eyes.”</p>
            <p>“Gods run their world through influence of their vessels. Powers of these gods have a magnitude that would scar the earth to ash and fire. Wild magic and silence would be left in their wake.”</p>
            <p>“Let me show you. What you don't understand”</p>
            <p>“One god would follow another.And soon the gods would start a war.Thank the gods for not dealing their affairs here in Gielinor”</p>
        </div>

        `;
    }
    if (intersects[i].object.name === "Anubis"){
        document.querySelector(".Text-Container").innerHTML = `
        <p class="him"> Anubis </p>
        <p>Anubis was the ruler of the ancient city. He ruled his land with strength and prestige. His only goal was conquest.

        Ideologies of others did not concern him. The gods held powers which he sought out to get. They're followers were mere vessels of power he could tap from. The only god he acknowledged was Zaros. The ideology of power was something he could relate to. Yet he would not pray to any god, even Zaros.
        
        This did not shun Anubis from the god, but rather gave him his blessings. Zaros has chosen another vessel to carry his power.
        </p>
        <div class='quoates'>
            <p>“Your prayers are mere pleads. You revoke power that is yours and knee to a higher stance of power.”</p>
            <p>“I will give you power so that you may serve me.”</p>
            <p>“Fools don't realise the power handed only adds Whatever strength they had to me.”</p>
            <p>“Zaros, I have noticed your favour. Don't think that this earns you mines."</p>
        </div>
        `;
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

function changeText(){
  if (curentframe === 2){
    document.querySelector(".Text-Container").innerHTML = `
    <p class="him"> Slave Master Grador </p>
    <p>Graardor is known for his strength and ruthlessness.
    He is contemptuous with the position he has been given. Though he sees himself more as a tyrant. his goal is to amass an army, so that he could take part in Anubis great conquest.
    Anubis is the only person he would not raise his hand against. As he seen the devastation that has been caused by his rage. Graardor praises this aspect of Anubis. He sees his god's will in him.
    </p>
    <div class='quoates'>
        <p>“I subdued all the ogres and giants of these sandy lands in my pursuit for Anubis. You punny imp, face more than you can handle. SCRAM”</p>
        <p>	“The look in your eyes is something. You will be a good addition to my chariot”</p>
        <p>“Struggle, rage, rampage.Show me what that feels like Once more.”</p>
        <p>“You have your entire life To slave for. It's honest work I'll tell you.”</p>
    </div>
    `;
  }
  if (curentframe === 1){
      document.querySelector(".Text-Container").innerHTML = `
      <p class="him"> Kree'arra </p>
      <p>Kree'arra roams the Kharidian deserts, with her loyal fleet. Enforcing the law so that peace could thrive within the desert. She calms the lives of it's residents by giving them protection.
      Anubis respects Kree'arra for helping him to uphold his rule. 
      Kree'arra wishes to lift some of Anubis burdens. Since she sees all the good that has come to the desert because of its thriving king.
      </p>
      <div class='quoates'>
          <p>“The crime of War is lifted by the gods themselves. Even so, there are exceptions that even in the heart of war should be upheld.”</p>
          <p>“I Question my actions when faced with you. Why is that?”</p>
          <p>“Even tough Graardor was great for thoseing criminals at. I'am glad to witness his demise. ”</p>
          <p>“Your crimes would be forgiven by your province in war. Join us, redemption is my gift to you.”</p>
      </div>
      `;
  }
  if (curentframe === 3){
      document.querySelector(".Text-Container").innerHTML = `
      <p class="him"> Zilyana </p>
      <p> She eventually confronted Anubis in his conquest to take Gielinor. This broke out into a fight, as rage took over anubis. The fight reached a point that made the gods intervened. Saradomin 
      Blessed Zilyana with more power to no avail. as the magic spells Anubis had conjured overwhelmed her. Power alone wasn't enough.
      Had she continued. This battle could have ended in death for one of them. For now she leaves the throne to anubis. 
      </p>
      <div class='quoates'>
          <p>“His wrath and diligence scares even the gods. If Saradomin grace hadn't come in such haste, we wouldn't have known of the gods watchful eyes.”</p>
          <p>“Gods run their world through influence of their vessels. Powers of these gods have a magnitude that would scar the earth to ash and fire. Wild magic and lawless plains would be left in their wake.”</p>
          <p>“Let me show you. What you don't understand”</p>
          <p>“One god would follow another.And soon the gods would start a war.Thank the gods for not dealing their affairs here in Gielinor”</p>
      </div>

      `;
  }
  if (curentframe === 0){
      document.querySelector(".Text-Container").innerHTML = `
      <p class="him"> Anubis </p>
      <p>Anubis was the ruler of the ancient city. He ruled his land with strength and prestige. His only goal was conquest.

      Ideologies of others did not concern him. The gods held powers which he sought out to get. They're followers were mere vessels of power he could tap from. The only god he acknowledged was Zaros. The ideology of power was something he could relate to. Yet he would not pray to any god, even Zaros.
      
      This did not shun Anubis from the god, but rather gave him his blessings. Zaros has chosen another vessel to carry his power.
      </p>
      <div class='quoates'>
          <p>“Your prayers are mere pleads. You revoke power that is yours and knee to a higher stance of power.”</p>
          <p>“I will give you power so that you may serve me.”</p>
          <p>“Fools don't realise the power handed only adds Whatever strength they had to me.”</p>
          <p>“Zaros, I have noticed your favour. Don't think that this earns you mines."</p>
      </div>
      `;
  }
}
function animateForward(){
  if(camAnimation && camAnimation.timeScale !== undefined){
    camAnimation.timeScale = 1;
    clearTimeout(pauseTimeout);
    camAnimation.paused = false;
    camAnimation.play();
    pauseTimeout = setTimeout(() => {
      camAnimation.paused = true;
    }, 1000);
  }
  changeText();
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
  }
  changeText();
  console.log("going Backwards " + curentframe);
  theValue = 0;
}

var theValue = 0;
var winSize = false;
var camSwitch = false;
// event listener for mouse click
window.addEventListener('click', onMouseClick, false);
document.getElementById('Backto').addEventListener('click', function(){window.location.href = "./index.html";});
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