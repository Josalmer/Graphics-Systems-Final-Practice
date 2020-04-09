class Obstacle extends THREE.Object3D {
  constructor(type) {
    super();
    this.model = this.createObstacle(type);
    this.add(this.model);
  }
  createObstacle(type) {
    var model = new THREE.Object3D();
    // instantiate a loader
    var mtLoader = new THREE.MTLLoader();
    mtLoader.load('./models/stop/StopSign.mtl', function (materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      // load a resource
      objLoader.load(
        // resource URL
        './models/stop/StopSign.obj',
        // called when resource is loaded
        function (object) {
          model.add(object);
          object.scale.set(0.5, 0.5, 0.5);
          object.position.y = 1.1;
          object.rotation.y = Math.PI / 2;
        },
        // called when loading is in progresses
        function (xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // called when loading has errors
        function (error) {
          console.log('An error happened');
        }
      );
    });
    return model;
  }

  createObstacleWithoutMaterial(type) {
    var model = new THREE.Object3D();
    // instantiate a loader
    var objLoader = new THREE.OBJLoader();
    // load a resource
    objLoader.load(
      // resource URL
      './models/Robot.obj',
      // called when resource is loaded
      function (object) {
        model.add(object);
        object.scale.set(1, 1, 1);
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened');
      }
    );

    return model;
  }
}