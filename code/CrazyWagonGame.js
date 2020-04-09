class crazyWagonGame extends THREE.Object3D {
  constructor() {
    super();

    this.gameData = this.initGame();

    this.spline = this.createSpline();

    this.rail = new Rail(this.spline);
    this.add(this.rail);

    this.wagon = new Wagon();
    this.add(this.wagon);

    var p = this.spline.getPointAt(0);
    // obtenemos tangente a la curva en p
    var tangente = this.spline.getTangentAt(0);
    this.wagon.position.copy(p);
    p.add(tangente);
    this.wagon.lookAt(p); // ponemos al objeto mirando hacia la tangente
  }

  initGame() {
    var gameData = {
      initialTime: 45 * 1000,   // 45 segundos una vuelta
      minimumTime: 15 * 1000,   // 20 segundos una vuelta
      deltaTime: 10 * 1000,      // 10 segundos se recorta cada vuelta
      currentTime: 55 * 1000,
      lapNumber: 0,
      t_prev: 99,
      timeNewLap: Date.now()
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

  update() {
    // parametro t entre 0 y 1
    // Representa posición en el spline
    // 0 principio
    // 1 final
    var timeActual = Date.now() - this.gameData.timeNewLap;
    var looptime = this.gameData.currentTime;
    var t = (timeActual % looptime) / looptime;

    if (this.gameData.t_prev > t) {
      // nueva vuelta     
      this.gameData.lapNumber += 1;

      if (this.gameData.currentTime - this.gameData.deltaTime >= this.gameData.minimumTime) {
        this.gameData.currentTime -= this.gameData.deltaTime;
      } else {
        this.gameData.currentTime = this.gameData.minimumTime;
      }
      this.gameData.timeNewLap = Date.now();
      t = 0;
    }
    this.gameData.t_prev = t;
    // obtener punto p donde esta el objeto
    var p = this.spline.getPointAt(t);
    // obtenemos tangente a la curva en p
    var tangente = this.spline.getTangentAt(t);
    this.wagon.position.copy(p);
    p.add(tangente);
    this.wagon.lookAt(p); // ponemos al objeto mirando hacia la tangente
  }
}