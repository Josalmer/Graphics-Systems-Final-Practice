class Wagon extends THREE.Object3D {
  constructor() {
    super();
    this.wagonModel = this.createWagonModel();
    this.add(this.wagonModel);

    this.collisionsModel = this.createCollisionsModel();
    this.add(this.collisionsModel);

    this.wagonCam = this.createWagonCam();
    this.add(this.wagonCam);
  }

  createWagonModel() {
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
        function (object) {
          wagon.add(object);
          object.scale.set(0.5, 0.5, 0.5);
          object.position.y = 1.1;
          object.rotation.y = - Math.PI;
        }
      );
    });

    return wagon;
  }

  createWagonCam() {
    var camera = new THREE.Object3D();
    // Camara en el wagon
    // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    // fov — Camera frustum vertical field of view.
    // aspect — Camera frustum aspect ratio.
    // near — Camera frustum near plane.
    // far — Camera frustum far plane.
    var splineCamera = new THREE.PerspectiveCamera(86, window.innerWidth / window.innerHeight, 0.01, 1000);
    splineCamera.position.y = 1.75;
    splineCamera.position.z = 0.7;
    splineCamera.rotation.y = - Math.PI;
    splineCamera.rotation.x = Math.PI / 18;

    camera.add(splineCamera)

    return camera;
  }

  createCollisionsModel() {
    var collisions = new THREE.Object3D();
    var geometry = new THREE.CubeGeometry( 0.85, 0.85, 2.83);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: false} );
    var box = new THREE.Mesh( geometry, material );
    box.position.y = 1.4;
    box.position.z = 0.04;
    collisions.add( box );

    return collisions;
  }
}