import * as THREE from 'three';

class Smoke {
  constructor(element, options) {
    const defaults = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.element = element;

    Object.assign(this, options, defaults);
    this.onResize = this.onResize.bind(this);

    this.addEventListeners();
    this.init();
  }

  init() {
    const { element, width, height } = this;

    this.clock = new THREE.Clock();

    // Create a WebGLRenderer with transparent background
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: element,
      alpha: true,  // Enable transparent background
      antialias: true,  // Enable antialiasing for smoother particles
    });

    renderer.setSize(width, height);

    // Set the background color to transparent
    renderer.setClearColor(0x000000, 0); // Transparent background (0 is the alpha value)

    this.scene = new THREE.Scene();

    // Create a mesh (statue or object) in the scene
    const meshGeometry = new THREE.BoxGeometry(200, 200, 200);
    const meshMaterial = new THREE.MeshLambertMaterial({
      color: 0xaa6666,
      wireframe: false,
    });
    this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
    this.mesh.position.set(0, -100, 0); // Adjust the statue's position
    this.scene.add(this.mesh);

    this.cubeSineDriver = 0;

    this.addCamera();
    this.addLights();
    this.addParticles();
  }

  evolveSmoke(delta) {
    const { smokeParticles } = this;

    let smokeParticlesLength = smokeParticles.length;

    while (smokeParticlesLength--) {
      smokeParticles[smokeParticlesLength].rotation.z += delta * 0.2;
    }
  }

  addLights() {
    const { scene } = this;
    const light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(-1, 0, 1);
    scene.add(light);
  }

  addCamera() {
    const { scene } = this;
    const camera = this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
    camera.position.z = 1000;
    scene.add(camera);
  }

  addParticles() {
    const { scene } = this;
    const textureLoader = new THREE.TextureLoader();
    const smokeParticles = this.smokeParticles = [];

    textureLoader.load('./src/img/clouds.png', (texture) => {
      const smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true,  // Ensure transparency for smoke
        opacity: 0.7,  // Optional: Adjust the opacity of the smoke
      });
      smokeMaterial.map.minFilter = THREE.LinearFilter;

      const smokeGeometry = new THREE.PlaneGeometry(100, 100); // Particle size

      const smokeMeshes = [];
      let limit = 150;

      while (limit--) {
        smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);
        
        // Position smoke on the left part of the screen (adjust the x, y, z values as needed)
        smokeMeshes[limit].position.set(
            Math.random() * 300 - 600, 
            Math.random() * 300 - 150,
            Math.random() * 1000 - 500
        );
        
        // Random rotation for each particle
        smokeMeshes[limit].rotation.z = Math.random() * 360;

        smokeParticles.push(smokeMeshes[limit]);
        scene.add(smokeMeshes[limit]);
      }
    });
  }

  render() {
    const { mesh } = this;
    let { cubeSineDriver } = this;

    cubeSineDriver += 0.001;

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    mesh.position.z = 100 + Math.sin(cubeSineDriver) * 500;

    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.evolveSmoke(this.clock.getDelta());
    this.render();

    requestAnimationFrame(this.update.bind(this));
  }

  onResize() {
    const { camera } = this;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    this.renderer.setSize(windowWidth, windowHeight);
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }
}

export default Smoke;
