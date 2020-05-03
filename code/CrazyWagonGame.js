class CrazyWagonGame extends THREE.Object3D {
  constructor(level, mapa = 1) {
    super();

    this.gameData = this.initData(level);

    this.spline = this.createSpline(mapa);

    this.loadModels(mapa);

    this.setObjectsInitialPosition();
  }


  ///////////////////////////////////////////////////////////////////////////
  // GETTERS //
  ///////////////////////////////////////////////////////////////////////////

  getBallonAtIndex(index) {
    return this.balloons[index];
  }

  getObstacleAtIndex(index) {
    return this.obstacles.children[index];
  }

  getObstacleCollidableMeshAtIndex(index) {
    return this.obstacles.children[index].collidableSphere.children[0];
  }

  ///////////////////////////////////////////////////////////////////////////
  // BUILD AND LOAD FUNCTIONS //
  ///////////////////////////////////////////////////////////////////////////

  loadModels(mapa) {
    this.rail = new Rail(this.spline, mapa);
    this.add(this.rail);

    this.wagon = new Wagon();
    this.add(this.wagon);

    this.obstacles = this.createObstacles();
    this.add(this.obstacles);

    this.balloons = this.createBalloons(mapa);
  }

  createSpline(mapa) {

    var spline1 = new THREE.CatmullRomCurve3([
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

    var spline2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 10), new THREE.Vector3(-7, 7, 12),
      new THREE.Vector3(-13, 12, 13), new THREE.Vector3(-15, 16, 0),
      new THREE.Vector3(-12, 20, -30), new THREE.Vector3(12, 12, -15),
      new THREE.Vector3(-10, 27, 10),
      new THREE.Vector3(24, 45, 35), new THREE.Vector3(14, 40, 40),
      new THREE.Vector3(-10, 15, 35), new THREE.Vector3(0, 30, 4),
      new THREE.Vector3(-20, 8, -25), new THREE.Vector3(-25, 10, 0),
      new THREE.Vector3(0, 30, 25), new THREE.Vector3(30, 25, 10),
      new THREE.Vector3(30, 20, 0), new THREE.Vector3(0, 10, 10)
    ]);

    return mapa == 1 ? spline1 : spline2;
  }

  initData(level) {
    var gameData = {
      level: level,
      minimumTime: 20 * 1000,   // 20 segundos una vuelta
      deltaTime: 2.5 * 1000,    // se recorta cada vuelta 2.5 seconds
      currentLapDuration: (49 - (4 * level)) * 1000, // 45 easy, 43 medium, 41 hard
      lapNumber: 0,
      timeAtCurrentLap: 0,
      obstaclesLoaded: 0,
      nObstacles: 20 * level,
      nballoons: 20
    };
    return gameData;
  }

  createObstacles() {
    var obstacles = new THREE.Group();
    for (let i = 0; i < this.gameData.nObstacles; i++) {
      obstacles.add(new Obstacle(Math.trunc(this.getRandom(0, 6)), this));
    }
    return obstacles;
  }

  countObstacleLoaded() {
    this.gameData.obstaclesLoaded++;
    if (this.gameData.obstaclesLoaded == this.gameData.nObstacles) {
      setTimeout(() => {
        document.getElementById("game").style.display = "block";
        document.getElementById("loading-screen").style.display = "none";
      }, 2000);
    }
  }

  createBalloons(mapa) {
    var positions1 = [
      new THREE.Vector3(10, 10, 15), new THREE.Vector3(-10, 15, 0),
      new THREE.Vector3(0, 20, -10), new THREE.Vector3(-10, 25, -10),
      new THREE.Vector3(24, 30, 10), new THREE.Vector3(-20, 35, 20),
      new THREE.Vector3(17, 35, -20), new THREE.Vector3(-18, 35, -18),
      new THREE.Vector3(23, 30, 20), new THREE.Vector3(-20, 25, 30),
      new THREE.Vector3(-10, 20, -24), new THREE.Vector3(-30, 15, -30),
      new THREE.Vector3(13, 10, 46), new THREE.Vector3(-18, 15, 40),
      new THREE.Vector3(10, 20, -30), new THREE.Vector3(15, 25, 15),
      new THREE.Vector3(10, 30, 34), new THREE.Vector3(-30, 35, 0),
      new THREE.Vector3(0, 35, -35), new THREE.Vector3(-20, 35, 0)
    ]
    var positions2 = [
      new THREE.Vector3(10, 10, 15), new THREE.Vector3(-10, 15, 0),
      new THREE.Vector3(0, 20, -10), new THREE.Vector3(-10, 25, -10),
      new THREE.Vector3(24, 30, 10), new THREE.Vector3(-20, 35, 20),
      new THREE.Vector3(17, 35, -20), new THREE.Vector3(-18, 35, -18),
      new THREE.Vector3(23, 30, 20), new THREE.Vector3(-20, 25, 30),
      new THREE.Vector3(-10, 20, -24), new THREE.Vector3(-30, 15, -30),
      new THREE.Vector3(13, 10, 46), new THREE.Vector3(-18, 15, 40),
      new THREE.Vector3(10, 20, -30), new THREE.Vector3(15, 25, 15),
      new THREE.Vector3(10, 30, 34), new THREE.Vector3(-30, 35, 0),
      new THREE.Vector3(0, 35, -35), new THREE.Vector3(-20, 35, 0)
    ]
    var balloons = [];
    var positions = mapa == 1 ? positions1 : positions2;
    for (let i = 0; i < this.gameData.nballoons; i++) {
      let radio = Math.floor(this.getRandom(0.8, 2));
      let newBalloon = this.createBalloon(radio);
      newBalloon.position.copy(positions[i]);
      balloons.push(newBalloon);
      this.add(newBalloon);
    }
    return balloons;
  }

  createBalloon(radio) {
    var ballTexture = new THREE.TextureLoader().load("imgs/balloons.png");
    var ballMaterial = new THREE.MeshPhongMaterial({ map: ballTexture });
    var ballGeo = new THREE.SphereGeometry(radio);
    var ball = new THREE.Mesh(ballGeo, ballMaterial);
    ball.subiendo = false;

    return ball;
  }

  setObjectsInitialPosition() {
    this.placeObjectOnLine(this.wagon, 0);// posicionar wagon

    // posicionar obstaculos
    let n_obstacles = this.obstacles.children.length;
    for (let i = 0; i < n_obstacles; i++) {
      this.placeObjectOnLine(this.getObstacleAtIndex(i), i / n_obstacles, this.getRandom(0, 2 * Math.PI));
    }
  }

  placeObjectOnLine(obj, t, rotation = 0) {
    var p = this.spline.getPointAt(t);
    var tangente = this.spline.getTangentAt(t);
    obj.position.copy(p);
    p.add(tangente);
    obj.lookAt(p); // ponemos al objeto mirando hacia la tangente
    if (rotation != 0) {
      obj.model.rotation.z = rotation;
      obj.collidableSphere.rotation.z = rotation;
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // ANIMATION FUNCTIONS //
  ///////////////////////////////////////////////////////////////////////////

  getParamT(deltaTime) {
    // parametro t entre 0 y 1
    // Representa posición en el spline
    // 0 principio
    // 1 final

    this.gameData.timeAtCurrentLap += deltaTime;
    if (this.gameData.timeAtCurrentLap > this.gameData.currentLapDuration) {
      this.finishLap();
    }
    var t = this.gameData.timeAtCurrentLap / this.gameData.currentLapDuration;
    return t;
  }

  finishLap() {
    this.gameData.timeAtCurrentLap = 0;
    this.gameData.lapNumber += 1;
    document.getElementById("laps").textContent = "Laps: " + this.gameData.lapNumber;
    if (this.gameData.currentLapDuration - this.gameData.deltaTime >= this.gameData.minimumTime) {
      this.gameData.currentLapDuration -= this.gameData.deltaTime;
    } else {
      this.gameData.currentLapDuration = this.gameData.minimumTime;
    }
  }

  moveBalloons(deltaTime) {
    for (let i = 0; i < this.balloons.length; i++) {
      let ballon = this.getBallonAtIndex(i);
      let veloc = deltaTime * (2 + i) * 0.0002 * this.gameData.level;
      if (ballon.subiendo) {
        if (ballon.position.y < 40) {
          ballon.position.y += veloc;
        } else {
          ballon.subiendo = false;
          ballon.position.y -= veloc;
        }
      } else {
        if (ballon.position.y > 5) {
          ballon.position.y -= veloc;
        } else {
          ballon.subiendo = true;
          ballon.position.y += veloc;
        }
      }
    }
  }

  moveWagon(deltaTime) {
    var t = this.getParamT(deltaTime);
    // obtener punto p donde esta el objeto
    var p = this.spline.getPointAt(t);
    // obtenemos tangente a la curva en p
    var tangente = this.spline.getTangentAt(t);

    this.wagon.position.copy(p);
    p.add(tangente);
    this.wagon.lookAt(p); // ponemos al objeto mirando hacia la tangente
  }

  update(deltaTime) {
    this.moveBalloons(deltaTime);
    this.moveWagon(deltaTime);
  }

  ///////////////////////////////////////////////////////////////////////////
  // INTERACTION FUNCTIONS //
  ///////////////////////////////////////////////////////////////////////////

  turnRight() {
    this.wagon.wagonModel.rotation.z += 0.07;
    this.wagon.wagonCam.rotation.z += 0.07;
    this.wagon.collidableSphere.rotation.z += 0.07;
  }

  turnLeft() {
    this.wagon.wagonModel.rotation.z -= 0.07;
    this.wagon.wagonCam.rotation.z -= 0.07;
    this.wagon.collidableSphere.rotation.z -= 0.07;
  }

  ///////////////////////////////////////////////////////////////////////////
  // MISC //
  ///////////////////////////////////////////////////////////////////////////

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}