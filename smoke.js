import * as THREE from 'three';

class Smoke {
  constructor(scene, camera, renderer, options = {}) {
    const defaults = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.scene = scene; // Use the existing scene
    this.camera = camera; // Use the existing camera
    this.renderer = renderer; // Use the existing renderer

    Object.assign(this, defaults, options);

    this.clock = new THREE.Clock();
    this.smokeParticles = [];
    this.cubeSineDriver = 0;

    this.init();
  }

  init() {
    // this.addLights();    
    this.addParticles(); 
  }

  evolveSmoke(delta) {
    this.smokeParticles.forEach((particle) => {
      particle.rotation.z += delta * 0.2;
    });
  }

  applyBillboarding() {
    // Align each smoke particle to face the camera
    this.smokeParticles.forEach((particle) => {
      particle.lookAt(this.camera.position); 
    });
  }

  addLights() {
    const light = new THREE.DirectionalLight(0x753338, 0.2);
    light.position.set(-1, 0, 1);
    this.scene.add(light);
  }

  addParticles() {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load('./src/img/clouds.png', (texture) => {
      const smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: texture,
        transparent: false,
        depthWrite: false,  // Fix transparency rendering order
        opacity: 0.5,
      });

      const smokeGeometry = new THREE.PlaneGeometry(300, 300);

      for (let i = 0; i < 50; i++) {
        const particle = new THREE.Mesh(smokeGeometry, smokeMaterial);

        // Position the smoke particles randomly
        particle.position.set(
          Math.random() * 50 - 25,
          Math.random() * 20 - 10,
          Math.random() * 75 - 50
        );

        particle.rotation.z = Math.random() * Math.PI;
        this.smokeParticles.push(particle);
        this.scene.add(particle); // Add the particle to the main scene
      }
    });
  }

  update() {
    const delta = this.clock.getDelta();
    this.evolveSmoke(delta);
    // this.applyBillboarding(); // Make particles face the camera
  }
}

export default Smoke;
