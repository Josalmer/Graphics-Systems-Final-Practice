// Jose Saldaña Y Alberto Rodriguez

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.showInitMenu = true;

    this.renderer = this.createRenderer(myCanvas);

    this.gui = this.createGUI();

    this.createLights();

    this.createCamera();

    this.axis = new THREE.AxesHelper(10);
    this.add(this.axis);

    this.game = new CrazyWagonGame();
    this.add(this.game);

    this.sky = new Environment();
    this.add(this.sky);
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
  }

  createGUI() {
    var gui = new dat.GUI();
    this.guiControls = new function () {
      this.lightIntensity = 1;
      this.axisOnOff = true;
      this.animate = false;
      this.wagonCamera = false;
    }
    var folder = gui.addFolder('Luz y Ejes');
    folder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');
    folder.add(this.guiControls, 'axisOnOff').name('Mostrar ejes : ');
    folder.add(this.guiControls, 'animate').name('Animation : ').listen();
    folder.add(this.guiControls, 'wagonCamera').name('Wagon view : ').listen();

    return gui;
  }

  createLights() {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add(ambientLight);
    this.spotLight = new THREE.SpotLight(0xffffff, this.guiControls.lightIntensity);
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

  getCamera() {
    return this.guiControls.wagonCamera ? this.game.wagon.wagonCam.children[0] : this.camera;
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  //Funcion para controlar la entrada de teclado
  setupKeyControls() {
    var that = this;
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 37: // Tecla derecha
          that.game.turnRight();
          break;
        case 39: // Tecla izquierda
          that.game.turnLeft();
          break;
        case 72: //Tecla H - Help
          that.showHideHelp();
          break;
        case 32: //espacio
          that.startGame();
          break;
      }
    };
  }

  showHideHelp() {
    this.showInitMenu = !this.showInitMenu;
    document.getElementById("menuAyuda").style.display = this.showInitMenu ? "none" : "block";
  }

  startGame() {
    document.getElementById("menuInicio").style.display = "none";
    this.showInitMenu = false;
    if(this.game.gameData.gameRunning == false){
      console.log(this.game.gameData);
      this.game.gameData.gameStartedAt = new Date();
    }
    this.game.gameData.gameRunning = true;
    this.guiControls.animate = true;
    this.guiControls.wagonCamera = true;
  }

  updateCrono() {
    var ahora = new Date();
    var crono = new Date(ahora - this.game.gameData.gameStartedAt);
    
    this.minutos = crono.getMinutes();
    this.seconds = crono.getSeconds();
    this.miliseconds = crono.getMilliseconds();

    document.getElementById ("Minutes").innerHTML = "<h2>"+this.minutos+":</h2>";
    document.getElementById ("Seconds").innerHTML = "<h2>"+this.seconds+":</h2>";
    document.getElementById ("Milliseconds").innerHTML = "<h2>"+this.miliseconds+"</h2>";
  }

  update() {
    requestAnimationFrame(() => this.update())
    this.spotLight.intensity = this.guiControls.lightIntensity;
    this.axis.visible = this.guiControls.axisOnOff;

    //Evita que se actualice el cronometro despues de haber iniciado el juego (pulsado espacio)
    if(this.game.gameData.gameRunning == true){
      this.updateCrono();
    }
    
    this.cameraControl.update();
    if (this.guiControls.animate) {
      this.game.update();
    }
    this.renderer.render(this, this.getCamera());
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");

  window.addEventListener("resize", () => scene.onWindowResize());
  //Llamada a la funcion que controla las entradas del teclado
  window.addEventListener("keydown", () => scene.setupKeyControls());

  scene.update();
});
