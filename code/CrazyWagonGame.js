class CrazyWagonGame extends THREE.Object3D {
  constructor() {
    super();

    this.gameData = this.initData();

    this.spline = this.createSpline();

    this.rail = new Rail(this.spline);
    this.add(this.rail);

    this.wagon = new Wagon();
    this.add(this.wagon);

    this.obstacles = this.loadObstacles()
    this.add(this.obstacles);

    // this.octree = this.loadOctree()
    // this.add(this.octree);

    this.initModels();
  }

  initData() {
    var _initialTime = 45 * 1000; // 45 segundos una vuelta
    var _deltaTime = 10 * 1000;    // 10 segundos se recorta cada vuelta
    var gameData = {
      initialTime: _initialTime,
      minimumTime: 15 * 1000,     // 20 segundos una vuelta
      deltaTime: _deltaTime,
      currentTime: _initialTime + _deltaTime,
      lapNumber: 0,
      t_prev: 99,
      timeNewLap: Date.now(),
      gameRunning: false,
      gameStartedAt: null,
      obstaclesLoaded: 0,
      nObstacles: 45
    };
    return gameData;
  }

  createSpline() {
    var spline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 10), new THREE.Vector3(30, 20, 0),
      new THREE.Vector3(30, 25, 10), new THREE.Vector3(0, 30, 25),
      new THREE.Vector3(-25, 10, 0), new THREE.Vector3(-20, 8, -25),
      new THREE.Vector3(0, 30, 4), new THREE.Vector3(-10, 15, 35),
      new THREE.Vector3(14, 40, 40), new THREE.Vector3(24, 45, 35),
      new THREE.Vector3(-10, 27, 10),
      new THREE.Vector3(12, 12, -15), new THREE.Vector3(-12, 20, -30),
      new THREE.Vector3(-15, 16, 0), new THREE.Vector3(-13, 12, 13),
      new THREE.Vector3(-7, 7, 12), new THREE.Vector3(0, 10, 10)
    ]);
    return spline;
  }

  loadOctree() {
    this.octree = new THREE.Octree({
      undeferred: false,      // mejor rendimiento: los objetos se añaden al hacer update
      depthMax: Infinity,     // produnfidad maxima
      objectsThreshold: 4,    // numero de objetos para subidividir un nodo
      overlapPct: 0.2         // porcentaje de solapamiento entre nodos
    });

    for (let i = 0; i < this.obstacles.children.length; i++) {
      this.octree.add(this.obstacles.children[0].collisionsModel.children[0]);
    }

    return this.octree;
  }

  countObstacleLoaded() {
    this.gameData.obstaclesLoaded++;
    if (this.gameData.obstaclesLoaded == this.gameData.nObstacles) {
      document.getElementById("lyr_loading").style.display = "none";
    }
  }

  loadObstacles() {
    var obstacles = new THREE.Group();

    for (let i = 0; i < this.gameData.nObstacles; i++) {
      let obstacle = new Obstacle(Math.trunc(this.getRandom(0, 6)), this);
      obstacles.add(obstacle);
    }

    return obstacles;
  }

  initModels() {
    this.placeObject(this.wagon, 0);// posicionar wagon

    // posicionar obstaculos
    let n_obstacles = this.obstacles.children.length;
    for (let i = 0; i < n_obstacles; i++) {
      this.placeObject(this.obstacles.children[i], i / n_obstacles, this.getRandom(0, 2 * Math.PI));
    }
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  placeObject(obj, t, rotation = 0) {
    var p = this.spline.getPointAt(t);
    var tangente = this.spline.getTangentAt(t);
    obj.position.copy(p);
    p.add(tangente);
    obj.lookAt(p); // ponemos al objeto mirando hacia la tangente
    if (rotation != 0) {
      obj.model.rotation.z = rotation;
      obj.collisionsModel.rotation.z = rotation;
    }
  }

  getPosition() {
    // parametro t entre 0 y 1
    // Representa posición en el spline
    // 0 principio
    // 1 final
    var timeActual = Date.now() - this.gameData.timeNewLap;
    var looptime = this.gameData.currentTime;
    var t = (timeActual % looptime) / looptime;
    t = this.checkNewLap(t);
    return t;
  }

  checkNewLap(t) {
    if (this.gameData.t_prev > t) {
      // nueva vuelta     
      this.gameData.lapNumber += 1;
      document.getElementById ("Laps").innerHTML = "<h2>Laps: "+this.gameData.lapNumber+"</h2>";

      if (this.gameData.currentTime - this.gameData.deltaTime >= this.gameData.minimumTime) {
        this.gameData.currentTime -= this.gameData.deltaTime;
      } else {
        this.gameData.currentTime = this.gameData.minimumTime;
      }
      this.gameData.timeNewLap = Date.now();
      t = 0;
    }
    this.gameData.t_prev = t;
    return t;
  }

  turnRight() {
    this.wagon.wagonModel.rotation.z -= 0.05;
    this.wagon.wagonCam.rotation.z -= 0.05;
    this.wagon.collisionsModel.rotation.z -= 0.05;
  }

  turnLeft() {
    this.wagon.wagonModel.rotation.z += 0.05;
    this.wagon.wagonCam.rotation.z += 0.05;
    this.wagon.collisionsModel.rotation.z += 0.05;
  }

  update() {
    var t = this.getPosition();
    // obtener punto p donde esta el objeto
    var p = this.spline.getPointAt(t);
    // obtenemos tangente a la curva en p
    var tangente = this.spline.getTangentAt(t);

    this.wagon.position.copy(p);
    p.add(tangente);
    this.wagon.lookAt(p); // ponemos al objeto mirando hacia la tangente
  }
}