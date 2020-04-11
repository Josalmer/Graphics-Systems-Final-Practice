// Jose Saldaña Y Alberto Rodriguez

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.interfaceData = this.InterfaceData();

    this.renderer = this.createRenderer(myCanvas);

    this.createLights();

    this.createCamera();

    this.axis = new THREE.AxesHelper(10);
    this.add(this.axis);

    this.game = new CrazyWagonGame();
    this.add(this.game);

    this.environment = new Environment();
    this.add(this.environment);

    // this.collidableMeshList = [];
    // for (let i = 0; i < this.game.obstacles.children.length; i++) {
    //   this.collidableMeshList.push(this.game.obstacles.children[i]);
    // }
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

  toggleView(){
    this.interfaceData.wagonCamera = !this.interfaceData.wagonCamera;
  }

  toggleAnimation(){
    this.interfaceData.animate = !this.interfaceData.animate;
  }

  showHideHelp() {
    this.interfaceData.showHelpMenu = !this.interfaceData.showHelpMenu;
    document.getElementById("menuAyuda").style.display = this.interfaceData.showHelpMenu ? "none" : "block";
  }

  startGame() {
    document.getElementById("menuInicio").style.display = "none";
    document.getElementById("main-header").style.display = "block";
    this.interfaceData.showInitMenu = false;
    this.interfaceData.showHeader = true;
    if(this.game.gameData.gameRunning == false){
      this.game.gameData.gameStartedAt = new Date();
    }
    this.game.gameData.gameRunning = true;
    this.interfaceData.animate = true;
    this.interfaceData.wagonCamera = true;
    
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
        case 67: //Letra C
          that.toggleView();
          break;
        case 80: //Letra P
          that.toggleAnimation();
          break;
      }
    };
  }

  ///////////////////////////////////////////////////////////////////////////
  // ANIMATION //
  ///////////////////////////////////////////////////////////////////////////

  updateCrono() {
    var ahora = new Date();
    var crono = new Date(ahora - this.game.gameData.gameStartedAt);

    this.minutos = crono.getMinutes();
    this.seconds = crono.getSeconds();
    this.miliseconds = crono.getMilliseconds();

    document.getElementById("Minutes").innerHTML = "<h2>" + this.minutos + ":</h2>";
    document.getElementById("Seconds").innerHTML = "<h2>" + this.seconds + ":</h2>";
    document.getElementById("Milliseconds").innerHTML = "<h2>" + this.miliseconds + "</h2>";
  }

  update() {
    requestAnimationFrame(() => this.update())
    this.spotLight.intensity = this.interfaceData.lightIntensity;
    this.axis.visible = this.interfaceData.axisOnOff;

    this.cameraControl.update();

    if (this.interfaceData.animate) {
      this.game.update();
      this.updateCrono();
      // this.CheckCollision();
    }
    this.renderer.render(this, this.getCamera());

    // this.game.octree.update();
  }

  ///////////////////////////////////////////////////////////////////////////
  // INTERACTION //
  ///////////////////////////////////////////////////////////////////////////

  CheckCollision() {
    var wagon = this.game.wagon;
    var mesh = wagon.collisionsModel.children[0];
    var originPoint = wagon.position.clone();
    for (var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++)
    {		
      var localVertex = mesh.geometry.vertices[vertexIndex].clone();
      var globalVertex = localVertex.applyMatrix4( mesh.matrix );
      var directionVector = globalVertex.sub( wagon.position );

      var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
      var collisionResults = ray.intersectObjects( this.collidableMeshList );
      if ( collisionResults.length > 0) {
        console.log("Collision");
      }
    }	
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");

  window.addEventListener("resize", () => scene.onWindowResize());
  //Llamada a la funcion que controla las entradas del teclado
  window.addEventListener("keydown", () => scene.setupKeyControls());

  scene.update();
});
