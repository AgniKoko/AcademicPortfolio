import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Smoke from './smoke.js';

const modelContainer = document.getElementById('model');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
// renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

modelContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(2, 2, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enabled = false; 
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
// scene.add(groundMesh);

var background = new THREE.Mesh(
  new THREE.SphereGeometry(50, 64, 64), // Smooth geometry
  new THREE.MeshLambertMaterial({
    color: 0x404954, 
    side: THREE.BackSide,
  })
);
background.scale.y = 0.3; 
scene.add(background);

// scene.fog = new THREE.FogExp2(0x404954, 0.05); // Fog starts at 5 and ends at 50 units

// scene.background = new THREE.Color(0x101010); 
// scene.background = new THREE.Color("rgb(6, 7, 11)"); 

const ambientLight = new THREE.AmbientLight(0x222222, 1); //0x222222 0x753338
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x748db1, 7); //0x526682 0x748db1
// directionalLight.position.set(-35, 10, 3);
directionalLight.position.set(-35, 10, 3);
directionalLight.castShadow = true;
directionalLight.shadow.radius = 8;  // Increase this value for softer shadows
directionalLight.penumbra = 1;  // Increase for more softness (0 = hard shadow, 1 = fully soft)
directionalLight.shadow.mapSize.width = 2048; 
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1; // Start of shadow camera
directionalLight.shadow.camera.far = 40; // End of shadow camera
directionalLight.shadow.camera.left = -10; // Boundary of shadow camera
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.bias = -0.005; // Fine-tune this value
directionalLight.shadow.normalBias = 0.05; // Helps with uneven geometry
scene.add(directionalLight);

const directionalRightLight = new THREE.DirectionalLight(0x753338, 4);
directionalRightLight.position.set(10, -2, -7);
scene.add(directionalRightLight);

// const lightHelper = new THREE.SpotLightHelper(spotLight);
const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
// const lightHelper = new THREE.DirectionalLightHelper(directionalRightLight);
// scene.add(lightHelper);

const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);

const sl = new THREE.PointLight(0xf344d0, 3, 50, Math.PI / 6, 0.5, 0.5);
    sl.position.set(-0, 2, 0);
    // sl.radius = 1; 
    const slHelper = new THREE.PointLightHelper(sl);
    // scene.add(sl);
    // scene.add(slHelper);

const beamLight = new THREE.SpotLight(0xa2b1c5, 200, 100, 0.22, 1);
beamLight.position.set(-8, 5, -5); 
beamLight.target.position.set(0, 20, 0); 
beamLight.castShadow = true;
beamLight.shadow.bias = -0.0001;
scene.add(beamLight);
scene.add(beamLight.target);

const beamHeight = 50; 
const beamRadius = 5; 
const coneGeometry = new THREE.ConeGeometry(beamRadius, beamHeight, 32, 1, true);

const beamMaterial = new THREE.ShaderMaterial({
  // opacity: 0.1,
  transparent: true,
  uniforms: {
    beamColor: { value: new THREE.Color(0xa2b1c5) }, // Color of the foggy beam
    opacity: { value: 0.09 }, // Adjust opacity for subtle fog
    beamHeight: { value: beamHeight },
  },
  vertexShader: `
    varying float vDistance;
    void main() {
      vDistance = length(position); // Calculate the distance from the center
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 beamColor;
    uniform float beamHeight;
    uniform float opacity;
    varying float vDistance;

    void main() {
      // Apply a smooth fade effect based on the distance
      float intensity  = smoothstep(0.0, beamHeight, vDistance); // Adjust range for desired fade
      gl_FragColor = vec4(beamColor, opacity * intensity); // Set color with fade effect
    }
  `,
});

const beam = new THREE.Mesh(coneGeometry, beamMaterial);
beam.position.copy(beamLight.position); 
beam.lookAt(beamLight.target.position); 
scene.add(beam);

// const smoke = new Smoke(scene, camera, renderer);
// document.addEventListener('DOMContentLoaded', () => {
//   const smokeCanvas = document.querySelector('.js-smoke');

//   if (!smokeCanvas) {
//     console.error('Element with class ".js-smoke" not found!');
//     return;
//   }

//   const smoke2 = new Smoke(smokeCanvas);
//   smoke2.update(); // Start the smoke animation
// });

// Smoke Effect
const smokeParticles = [];
const textureLoader = new THREE.TextureLoader();

textureLoader.load('./src/img/clouds.png', (texture) => {
  const smokeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x526682,
    transparent: true,
    opacity: 0.05, // Mild smoke effect
    depthWrite: false, // Fix for transparency blending
  });

  const smokeGeometry = new THREE.PlaneGeometry(5, 5); // Adjust size as needed

  for (let i = 0; i < 90; i++) { // Add 30 particles
    const smokeMesh = new THREE.Mesh(smokeGeometry, smokeMaterial);

    // Position smoke only on the left side of the screen
    smokeMesh.position.set(
      Math.random() * 7 + -4, // X: Left side (-2 to -7 range)
      Math.random() * 4 + -1, // Y: Vertically centered (-1.5 to 1.5)
      Math.random() * 6 + 3 // Z: Shift forward (2 to 5)
    );

    // Random rotation
    smokeMesh.rotation.z = Math.random() * Math.PI * 2;

    scene.add(smokeMesh);
    smokeParticles.push(smokeMesh);
  }
});

// const loader = new GLTFLoader().setPath('src/millennium_falcon/');
// loader.load('scene.gltf', (gltf) => {
let mesh;
const loader = new GLTFLoader().setPath('src/democritus/');
loader.load('democritus.glb', (gltf) => {
  console.log('loading model');
  mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.geometry.computeVertexNormals();
      // child.material.roughness = 0.7; // Lower roughness for shinier surface
      // child.material.metalness = 0.5; // Add slight reflectivity
    }
  });
  
  mesh.position.set(3, 0, 0);
  mesh.scale.set(1.5, 1.5, 1.5); 
  scene.add(mesh);

  // document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

window.addEventListener('resize', () => {
  camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
});

let scrollProgress = 0; // Range: 0 to 1 (normalized scroll progress)
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = scrollTop / maxScroll;

  // Camera movement based on scroll
  camera.position.z = 10 - scrollProgress * 6; // Move closer
  camera.position.y = 2 - scrollProgress * 1.5; // Slight downward shift

  // Light intensity changes
  directionalLight.intensity = 5 - scrollProgress * 4.5; // Dim light
  ambientLight.intensity = 1 - scrollProgress * 0.8;

  // Adjust light position for effect
  directionalLight.position.y = 10 - scrollProgress * 5;
});

const clock = new THREE.Clock();
const clockSpeed = 0.9; // Lower values for slower animation

function animate() {
  requestAnimationFrame(animate);

  // Calculate elapsed time
  const elapsedTime = clock.getElapsedTime();

  // Update directional light intensity with a sine wave
  const lightIntensity = 4 + Math.sin(elapsedTime * clockSpeed) * 3; // Oscillates between 1 and 7
  directionalLight.intensity = lightIntensity;

  // Synchronize beam opacity with the directional light
  const beamOpacity = (Math.sin(elapsedTime * clockSpeed) + 1) / 2 * 0.09; // Oscillates between 0.0 and 0.05
  beamMaterial.uniforms.opacity.value = beamOpacity; // Update beam opacity

  // Rotate smoke particles for animation
  smokeParticles.forEach((particle) => {
    particle.rotation.z += 0.0018; // Slow rotation
  });
  
  if (mesh) {
    mesh.rotation.y += 0.001;
  }
  // smoke.update();
  controls.update();
  lightHelper.update(); 
  renderer.render(scene, camera);
}

animate();