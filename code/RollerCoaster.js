class RollerCoaster extends THREE.Object3D {
  constructor() {
    super();

    this.initialTime = 45 * 1000;   // 45 segundos una vuelta
    this.minimumTime = 15 * 1000;   // 20 segundos una vuelta
    this.deltaTime = 10 * 1000;      // 10 segundos se recorta cada vuelta
    this.currentTime = this.initialTime + this.deltaTime;
    this.lapNumber = 0;
    this.t_prev = 99;
    this.timeNewLap = Date.now();

    this.guide = this.createCurve();
    this.add(this.guide);

    this.wagon = this.createWagon();
    this.add(this.wagon);

    var p = this.curve.getPointAt(0);
    // obtenemos tangente a la curva en p
    var tangente = this.curve.getTangentAt(0);
    this.wagon.position.copy(p);
    p.add(tangente);
    this.wagon.lookAt(p); // ponemos al objeto mirando hacia la tangente
  }

  createCurve() {
    var guide = new THREE.Object3D();
    this.curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( 0, 10, 10 ), new THREE.Vector3( 30, 20, 0 ),
      new THREE.Vector3( 30, 25, 10 ), new THREE.Vector3( 0, 30, 25 ), 
      new THREE.Vector3( -25, 10, 0 ), new THREE.Vector3( -20, 8, -25 ),
      new THREE.Vector3( 0, 30, 4 ), new THREE.Vector3( -10, 15, 35 ),
      new THREE.Vector3( 14, 40, 40 ), new THREE.Vector3( 24, 45, 35 ),
      new THREE.Vector3( -10, 27, 10 ),
      new THREE.Vector3( 12, 12, -15 ), new THREE.Vector3( -12, 20, -30 ),
      new THREE.Vector3( -15, 16, 0 ), new THREE.Vector3( -13, 12, 13 ),
      new THREE.Vector3( -7, 7, 12 ), new THREE.Vector3( 0, 10, 10 )
    ] );
    // TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
    var geometry = new THREE.TubeGeometry(this.curve, 512, 0.5, 12, true);
    // Definir aquí el material de las guías
    var textureGuide = new THREE.TextureLoader().load( 'imgs/tubo1.jpg');
    var material = new THREE.MeshBasicMaterial( { map: textureGuide });
    var mesh = new THREE.Mesh( geometry, material );
    
    guide.add(mesh);
    return guide;
  }

  createWagon() {
    var wagon = new THREE.Object3D();
    // instantiate a loader
    var mtLoader = new THREE.MTLLoader();
    mtLoader.load('./models/aircraft/Aircraft_obj.mtl', function (materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      // load a resource
      objLoader.load(
        // resource URL
        './models/aircraft/Aircraft_obj.obj',
        // called when resource is loaded
        function ( object ) {
          wagon.add( object );
          object.scale.set(0.5, 0.5, 0.5);
          object.position.y = 0.9;
          object.rotation.y = - Math.PI;

        },
        // called when loading is in progresses
        function ( xhr ) {
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
          console.log( 'An error happened' );
        }
      );
    });

    // Camara en el wagon
    // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    // fov — Camera frustum vertical field of view.
    // aspect — Camera frustum aspect ratio.
    // near — Camera frustum near plane.
    // far — Camera frustum far plane.
    this.splineCamera = new THREE.PerspectiveCamera( 52, window.innerWidth / window.innerHeight, 0.01, 1000 );
    this.splineCamera.position.y = 1.60;
    this.splineCamera.position.z = 0.5;
    this.splineCamera.rotation.y = - Math.PI;
    this.splineCamera.rotation.x =  Math.PI / 9;
    wagon.add( this.splineCamera );

    return wagon;
  }

  update() {
    // parametro t entre 0 y 1
    // Representa posición en el spline
    // 0 principio
    // 1 final
    var timeActual = Date.now() - this.timeNewLap;
    var looptime = this.currentTime;
    var t = (timeActual % looptime) / looptime;

    if (this.t_prev > t) {
      // nueva vuelta     
      this.lapNumber += 1;

      if (this.currentTime - this.deltaTime >= this.minimumTime) {
        this.currentTime -= this.deltaTime;
      } else {
        this.currentTime = this.minimumTime;
      }
      this.timeNewLap = Date.now();
      t = 0;
    }
    this.t_prev = t;
    // obtener punto p donde esta el objeto
    var p = this.curve.getPointAt(t);
    // obtenemos tangente a la curva en p
    var tangente = this.curve.getTangentAt(t);
    this.wagon.position.copy(p);
    p.add(tangente);
    this.wagon.lookAt(p); // ponemos al objeto mirando hacia la tangente
  }
}