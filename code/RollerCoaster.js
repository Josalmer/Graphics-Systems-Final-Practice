// Jose Saldaña
// Mediante este ejercicio el alumno debe familiarizarse con las diferentes figuras 3D que
// proporciona la biblioteca THREE.JS y conocer sus principales parámetros.
class RollerCoaster extends THREE.Object3D {
  constructor() {
    super();

    this.recorrido = this.createCurva();
    this.add(this.recorrido);

    this.coche = this.createCoche();
    this.add(this.coche);
  }

  createCurva() {
    this.curve1 = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( 0, 6, 0 ),
      new THREE.Vector3( 12, 7, 3 ),
      new THREE.Vector3( 6, 2, -2 ),
      new THREE.Vector3( 0, 4, 0 )
    ] );

    this.curve2 = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( 0, 4, 0 ),
      new THREE.Vector3( -12, 7, 4 ),
      new THREE.Vector3( -9, 4, -2 ),
      new THREE.Vector3( 0, 6, 0 )
    ] );

    var points = this.curve1.getPoints( 50 );
    this.curve2.getPoints( 50 ).forEach(point => {
      points.push(point);
    });
    var geometry = new THREE.Geometry().setFromPoints( points );

    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    
    // Create the final object to add to the scene
    var splineObject = new THREE.Line( geometry, material );

    

    return splineObject;
  }

  createCoche() {
    var coche = new THREE.Object3D();

    // instantiate a loader
    var mtLoader = new THREE.MTLLoader();

    mtLoader.load('./models/car/911.mtl', function (materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      // load a resource
      objLoader.load(
        // resource URL
        './models/car/Porsche_911_GT2.obj',
        // called when resource is loaded
        function ( object ) {

          coche.add( object );    
          object.scale.set(0.5, 0.5, 0.5);
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

    return coche;
  }

  movAcelerandoFrenando(x) {
    return - 2 * Math.pow(x, 3) + 3 * Math.pow(x, 2);
  }

  update() {
    // parametro t entre 0 y 1
    // Representa posición en el spline
    // 0 principio
    // 1 final
    var timeActual = Date.now();

    var looptime = 12000;
    var aux = (timeActual % looptime)

    if (aux <= 4000) { // primer loop
      looptime = 4000;
      var t = aux / looptime; // t siempre entre 0 y 1
      t = this.movAcelerandoFrenando(t)
      
      // obtener punto p donde esta el objeto
      var p = this.curve1.getPointAt(t);
      // obtenemos tangente a la curva en p
      var tangente = this.curve1.getTangentAt(t);
    } else { // segundo loop
      looptime = 8000;
      var t = (aux - 4000) / looptime;
      t = this.movAcelerandoFrenando(t)

      // obtener punto p donde esta el objeto
      var p = this.curve2.getPointAt(t);
      // obtenemos tangente a la curva en p
      var tangente = this.curve2.getTangentAt(t);
    }

    this.coche.position.copy(p);
    p.add(tangente);
    this.coche.lookAt(p); // ponemos al objeto mirando hacia la tangente
  }
}