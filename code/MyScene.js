// Jose Saldaña Y Alberto Rodriguez

class MyScene extends THREE.Scene {
  constructor(myCanvas, level, map) {
    super();

    this.interfaceData = this.InterfaceData();

    this.renderer = this.createRenderer(myCanvas);

    this.createLights();

    this.createCamera();

    this.axis = new THREE.AxesHelper(10);
    this.add(this.axis);

    this.game = new CrazyWagonGame(level, map);
    this.add(this.game);

    this.environment = new Environment(map);
    this.add(this.environment);
  }


  ///////////////////////////////////////////////////////////////////////////
  // SCENE MUST BE //
  ///////////////////////////////////////////////////////////////////////////

  InterfaceData() {
    var userInt = {
      showInitMenu: true,
      showHelpMenu: true,
      lightIntensity: 0.75,
      axisOnOff: true,
      animate: false,
      wagonCamera: false
    };
    return userInt;
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(30, 70, 60);
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);
    this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
    this.cameraControl.enabled = true;
  }

  createLights() {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add(ambientLight);
    this.spotLight = new THREE.SpotLight(0xffffff, this.interfaceData.lightIntensity);
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
    this.interfaceData.animate = !this.interfaceData.animate;
    document.getElementById("pause").style.display = this.interfaceData.animate ? 'none' : 'block';
  }

  toggleHelp() {
    this.interfaceData.showHelpMenu = !this.interfaceData.showHelpMenu;
    document.getElementById("menuAyuda").style.display = this.interfaceData.showHelpMenu ? "none" : "block";
  }

  startGame() {
    if (this.game.gameData.gameStartedAt == null) {
      document.getElementById("menuInicio").style.display = "none";
      document.getElementById("main-header").style.display = "block";
      document.getElementById("balloons").textContent = 'Balloons destroyed: 0 / ' + this.game.gameData.nballoons;
      this.interfaceData.showInitMenu = false;
      this.interfaceData.showHeader = true;
      this.game.gameData.gameStartedAt = new Date();
      this.interfaceData.animate = true;
      this.interfaceData.wagonCamera = true;
    }
  }

  onMouseDown(event) {
    if (event.button == 0) {   // Left button
      this.checkRayPicking(event);
    }
  }

  //Funcion para controlar la entrada de teclado
  setupKeyControls() {
    var that = this;
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 37: // Tecla derecha
        case 65: // tecla a
          that.game.turnRight();
          break;
        case 39: // Tecla izquierda
        case 68: // Tecla d
          that.game.turnLeft();
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

  updateStats() {
    this.updateCrono();
    this.updateScore();
  }

  updateCrono() {
    let ahora = new Date();
    let crono = new Date(ahora - this.game.gameData.gameStartedAt);
    let output = "Time: " + crono.getMinutes() + ':' + crono.getSeconds() + ':' + Math.trunc(crono.getMilliseconds() / 10);

    document.getElementById("crono").textContent = output;
  }

  updateScore() {
    this.game.gameData.playerScore += 0.1 * (this.game.gameData.lapNumber + 1) * this.game.gameData.level;
    document.getElementById("score").textContent = "Score: " + Math.trunc(this.game.gameData.playerScore) + ' points';
  }

  update() {
    requestAnimationFrame(() => this.update())
    this.spotLight.intensity = this.interfaceData.lightIntensity;
    this.axis.visible = this.interfaceData.axisOnOff;

    this.cameraControl.update();

    if (this.interfaceData.animate) {
      this.game.update();
      this.updateStats();
      this.CheckCollision();
    }
    this.renderer.render(this, this.getCamera());

    // this.game.octree.update();
  }

  ///////////////////////////////////////////////////////////////////////////
  // INTERACTION //
  ///////////////////////////////////////////////////////////////////////////

  updateStatAfterPickingBalloon() {
    this.game.gameData.playerScore += 100 * this.game.gameData.level;
    this.game.gameData.ballonsDeleted++;
    document.getElementById("balloons").textContent = 'Balloons destroyed: ' + this.game.gameData.ballonsDeleted + ' / ' + this.game.gameData.nballoons;
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

  CheckCollision() {
    var wagon = this.game.wagon.collidableSphere.children[0];
    for (let i = 0; i < this.game.obstacles.children.length; i++) {
      if (this.detectCollision(wagon, this.game.getObstacleCollidableMeshAtIndex(i))) {
        console.log("Collision:", i);
      }
    }
  }
}

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
  }, 3500);

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
});
