class MyScene extends THREE.Scene {
  constructor(myCanvas, level, map) {
    super();

    this.interfaceData = this.InterfaceData();

    this.renderer = this.createRenderer(myCanvas);

    this.initBackground(map);

    this.createLights(map);

    this.createCamera();

    this.loadAudio(map);

    this.game = new CrazyWagonGame(level, map);
    this.add(this.game);
  }

  ///////////////////////////////////////////////////////////////////////////
  // SCENE MUST BE //
  ///////////////////////////////////////////////////////////////////////////

  InterfaceData() {
    var userInt = {
      showInitMenu: true,
      showHelpMenu: true,
      animate: false,
      wagonCamera: false,
      lastTime: 0,
      chronoTime: 0,
      playerScore: 0,
      ballonsDeleted: 0,
      lives: 3,
      lastCollision: null,
      protected: null
    };
    return userInt;
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(30, 70, 80);
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);
    this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
    this.cameraControl.enabled = true;
    this.cameraControl.maxDistance = 130;
  }

  createLights(map) {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    var color = map == 1 ? 0x572364 : 0xFFFF00;
    this.add(ambientLight);
    this.spotLight = new THREE.SpotLight(color, 0.75);
    this.spotLight.position.set(60, 60, 40);
    this.add(this.spotLight);
  }

  createRenderer(myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);
    return renderer;
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initBackground(map) {
    var materialArray = [];

    var url = map == 1 ? 'imgs/ci_' : 'imgs/barren_';

    materialArray.push( url + 'ft.jpg');
    materialArray.push( url + 'bk.jpg');
    materialArray.push( url + 'up.jpg');
    materialArray.push( url + 'dn.jpg');
    materialArray.push( url + 'rt.jpg');
    materialArray.push( url + 'lf.jpg');

    var textureCube = new THREE.CubeTextureLoader().load(materialArray);
    this.background = textureCube;
  }
 
  ///////////////////////////////////////////////////////////////////////////
  // SOUNDS & MUSIC //
  /////////////////////////////////////////////////////////////////////////// 

  loadAudio(map) {
    var listener = new THREE.AudioListener();
    this.add(listener);
    this.music = new THREE.Audio(listener);
    this.balloonSound = new THREE.Audio(listener);
    this.collisionSound = new THREE.Audio(listener);
    this.audioLoader = new THREE.AudioLoader();
    this.loadMusic(map);
    this.loadSounds();
  }

  loadMusic(map) {
    let url = map == 1 ? './sounds/skullbeatz.mp3' : './sounds/morricone2.mov';
    var that = this;
    this.audioLoader.load(url, function (buffer) {
      that.music.setBuffer(buffer);
      that.music.setLoop(true);
      that.music.setVolume(0.15);
    });
  }

  loadSounds() {
    var that = this;
    this.audioLoader.load('./sounds/balloon.mp3', function (buffer) {
      that.balloonSound.setBuffer(buffer);
      that.balloonSound.setLoop(false);
      that.balloonSound.setVolume(0.3);
    });
    this.audioLoader.load('./sounds/collision.mp3', function (buffer) {
      that.collisionSound.setBuffer(buffer);
      that.collisionSound.setLoop(false);
      that.collisionSound.setVolume(0.3);
    });
  }

  playBalloonPickedSound() {
    if (this.balloonSound.isPlaying) {
      this.balloonSound.stop();
    }
    this.balloonSound.play();
  }

  playCollisionSound() {
    this.collisionSound.play();
  }

  playMusic() {
    this.music.play();
  }

  ///////////////////////////////////////////////////////////////////////////
  // GETTERS //
  ///////////////////////////////////////////////////////////////////////////

  getCamera() {
    return this.interfaceData.wagonCamera ? this.game.wagon.wagonCam.children[0] : this.camera;
  }

  ///////////////////////////////////////////////////////////////////////////
  // CONTROLS //
  ///////////////////////////////////////////////////////////////////////////

  toggleView() {
    this.interfaceData.wagonCamera = !this.interfaceData.wagonCamera;
  }

  toggleAnimation() {
    if (!this.animate) {
      this.interfaceData.lastTime = Date.now();
    }
    this.interfaceData.animate = !this.interfaceData.animate;
    document.getElementById("pause").style.display = this.interfaceData.animate ? 'none' : 'block';
  }

  toggleHelp() {
    this.interfaceData.showHelpMenu = !this.interfaceData.showHelpMenu;
    document.getElementById("menuAyuda").style.display = this.interfaceData.showHelpMenu ? "none" : "block";
  }

  startGame() {
    document.getElementById("menuInicio").style.display = "none";
    document.getElementById("main-header").style.display = "block";
    document.getElementById("protected").style.display = "block";
    document.getElementById("WebGL-output").style.filter = "grayscale(100%)";
    document.getElementById("balloons").textContent = 'Balloons destroyed: 0 / ' + this.game.gameData.nballoons;
    this.interfaceData.lastCollision = 0;
    this.interfaceData.protected = true;
    this.interfaceData.lastTime = Date.now();
    this.interfaceData.showInitMenu = false;
    this.interfaceData.showHeader = true;
    this.interfaceData.animate = true;
    this.interfaceData.wagonCamera = true;
    this.playMusic();
  }

  onMouseDown(event) {
    if (event.button == 0) {   // Left button
      if (this.interfaceData.animate) {
        this.checkRayPicking(event);
      }
    }
  }

  //Funcion para controlar la entrada de teclado
  setupKeyControls() {
    var that = this;
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 37: // Tecla izquierda
        case 65: // tecla a
          if (that.interfaceData.animate) {
            that.game.turnLeft();
          }
          break;
        case 39: // Tecla derecha
        case 68: // Tecla d
          if (that.interfaceData.animate) {
            that.game.turnRight();
          }
          break;
        case 72: //Tecla H - Help
          that.toggleHelp();
          break;
        case 67: //Letra C
          that.toggleView();
          break;
        case 80: //Letra P
          that.toggleAnimation();
          break;
        case 86: //Letra V
          console.log("Imprimir variables de control: ", this);
          break;
      }
    };
  }

  ///////////////////////////////////////////////////////////////////////////
  // ANIMATION //
  ///////////////////////////////////////////////////////////////////////////

  updateStats(deltaTime) {
    this.updateCrono(deltaTime);
    this.updateScore(deltaTime);
  }

  updateCrono(deltaTime) {
    this.interfaceData.chronoTime += deltaTime;
    let output = "Time: " + Math.floor(this.interfaceData.chronoTime / 60000)
                    + ':' + Math.floor((this.interfaceData.chronoTime % 60000) / 1000)
                    + ':' + Math.floor((this.interfaceData.chronoTime % 60000) % 1000)
    document.getElementById("crono").textContent = output;
  }

  updateScore(deltaTime) {
    this.interfaceData.playerScore += deltaTime * 0.001 * (this.game.gameData.lapNumber + 1) * this.game.gameData.level;
    document.getElementById("score").textContent = "Score: " + Math.trunc(this.interfaceData.playerScore) + ' points';
  }

  update() {
    requestAnimationFrame(() => this.update())
    this.cameraControl.update();

    if (this.interfaceData.animate) {
      var now =  Date.now();
      var deltaTime =  now - this.interfaceData.lastTime;
      this.interfaceData.lastTime = now;
      this.game.update(deltaTime);
      this.updateStats(deltaTime);
      if (!this.interfaceData.protected) {
        this.CheckCollision();
      } else {
        this.interfaceData.lastCollision += deltaTime;
        if (this.interfaceData.lastCollision > 3000) {
          this.interfaceData.protected = false;
          document.getElementById("protected").style.display = "none";
          document.getElementById("WebGL-output").style.filter = "";
        }
      }
    }
    this.renderer.render(this, this.getCamera());
  }

  ///////////////////////////////////////////////////////////////////////////
  // INTERACTION //
  ///////////////////////////////////////////////////////////////////////////

  updateStatAfterPickingBalloon() {
    this.interfaceData.playerScore += 100 * this.game.gameData.level;
    this.interfaceData.ballonsDeleted++;
    document.getElementById("balloons").textContent = 'Balloons destroyed: ' + this.interfaceData.ballonsDeleted + ' / ' + this.game.gameData.nballoons;
  }

  checkRayPicking(event) {
    var mousePosition = new THREE.Vector2();
    //Calculo de la posicion (x,y) del click del raton
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = 1 - 2 * (event.clientY / window.innerHeight);

    //Crea un rayo que parte de la camara y pasa por la posicion donde se ha clickado
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, this.getCamera());
    var intersectedObjects = raycaster.intersectObjects(this.game.balloons);
    if (intersectedObjects.length > 0) {

      this.updateStatAfterPickingBalloon();
      this.playBalloonPickedSound();

      // Hide object and make unselectable
      let pickedObject = intersectedObjects[0].object;
      this.game.balloons = this.game.balloons.filter(x => x != pickedObject);
      var material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      var material2 = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });
      pickedObject.material = material1;
      setTimeout(() => {
        pickedObject.material = material2;
      }, 1000);
    }
  }

  detectCollision(object1, object2) {
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();

    var sphere1 = object1.geometry.boundingSphere.clone();
    sphere1.applyMatrix4(object1.matrixWorld);

    var sphere2 = object2.geometry.boundingSphere.clone();
    sphere2.applyMatrix4(object2.matrixWorld);

    return sphere1.intersectsSphere(sphere2);
  }

  updateStatsAfterCollision() {
    this.interfaceData.protected = true;
    this.interfaceData.lastCollision = 0;
    this.interfaceData.lives--;
    document.getElementById("lives").textContent = 'Lives: ' + this.interfaceData.lives;
    if (this.interfaceData.lives == 0) {
      this.endGame();
    } else {
      document.getElementById("protected").style.display = "block";
      document.getElementById("WebGL-output").style.filter = "grayscale(100%)";
    }
  }

  endGame() {
    document.getElementById("menuFin").style.display = "block";
    document.getElementById("fin-score").textContent = "Score: " + Math.trunc(this.interfaceData.playerScore);
    document.getElementById("fin-laps").textContent = "Laps: " + this.game.gameData.lapNumber;
    document.getElementById("fin-balloons").textContent = "Balloons deleted: " + this.interfaceData.ballonsDeleted;
    document.getElementById("fin-time").textContent = document.getElementById("crono").textContent;
    document.getElementById("main-header").style.display = "none";
    this.interfaceData.animate = false;
    this.interfaceData.wagonCamera = false;
    this.music.stop();
  }

  CheckCollision() {
    var wagon = this.game.wagon.collidableSphere.children[0];
    for (let i = 0; i < this.game.obstacles.children.length; i++) {
      if (this.detectCollision(wagon, this.game.getObstacleCollidableMeshAtIndex(i))) {
        this.playCollisionSound();
        this.updateStatsAfterCollision();
      }
    }
  }
}

  ///////////////////////////////////////////////////////////////////////////
  // SCRIPT //
  ///////////////////////////////////////////////////////////////////////////

$(function () {
  function start(level) {
    document.getElementById("selectDifficult").style.display = 'none';
    document.getElementById("spinner").style.display = 'block';

    let map = document.getElementById("space-button").checked ? 1 : 2;
    console.log("Selected map: ", map);

    var scene = new MyScene("#WebGL-output", level, map);

    var startButton = document.getElementById('start-game-button');
    startButton.onclick = function StartAnimation() {
      scene.startGame();
    }

    window.addEventListener("resize", () => scene.onWindowResize());
    //Llamada a la funcion que controla las entradas del teclado
    window.addEventListener("keydown", () => scene.setupKeyControls());
    window.addEventListener("mousedown", (event) => scene.onMouseDown(event), true);
    scene.update();
  }

  setTimeout(() => {
    document.getElementById("welcome").style.display = 'none';
    document.getElementById("spinner").style.display = 'none';
    document.getElementById("selectDifficult").style.display = 'block';
  }, 2000);

  var easyButton = document.getElementById('easy-button');
  easyButton.onclick = function () {
    console.log("Loading game: Easy level");
    start(1);
  }

  var mediumButton = document.getElementById('medium-button');
  mediumButton.onclick = function () {
    console.log("Loading game: Medium level");
    start(1.5);
  }

  var hardButton = document.getElementById('hard-button');
  hardButton.onclick = function () {
    console.log("Loading game: Hard level");
    start(2);
  }

  var spaceButton = document.getElementById('space-button');
  spaceButton.onclick = function () {
    document.getElementById("space-button").checked = true;
    document.getElementById("west-button").checked = false;
  }

  var westButton = document.getElementById('west-button');
  westButton.onclick = function () {
    document.getElementById("space-button").checked = false;
    document.getElementById("west-button").checked = true;
  }

  var reloadButton = document.getElementById('reload-button');
  reloadButton.onclick = function () {
    location.reload();
  }
});
