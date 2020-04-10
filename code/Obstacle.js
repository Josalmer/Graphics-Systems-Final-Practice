class Obstacle extends THREE.Object3D {
  constructor(type, game) {
    super();
    this.model = this.createObstacle(type, game);
    this.add(this.model);

    this.collisionsModel = this.createCollisionsModel();
    this.add(this.collisionsModel);
  }

  createObstacle(type, game) {
    let mat_url = this.selectType(type) + '.mtl';
    let obj_url = this.selectType(type) + '.obj';
    var model = new THREE.Object3D();

    // instantiate a loader
    var mtLoader = new THREE.MTLLoader();
    mtLoader.load(mat_url, function (materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      // load a resource
      objLoader.load(
        // resource URL
        obj_url,
        // called when resource is loaded
        function (object) {
          model.add(object);
          object.scale.set(1.2, 1.2, 1.2);
          object.position.y = 0.68;
          object.rotation.y = - Math.PI;
          console.log("loader");
          game.countObstacleLoaded();
        }
      );
    });

    return model;
  }

  createCollisionsModel() {
    var collisions = new THREE.Object3D();
    var geometry = new THREE.CubeGeometry(0.48, 1.2, 0.48);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.y = 1.275;
    cube.position.z = 0.05;
    collisions.add(cube);

    return collisions;
  }

  selectType(index) {
    switch (index) {
      case 0: return './models/obstacles/command/command';
      case 1: return './models/obstacles/doctor/doctor';
      case 2: return './models/obstacles/sheriff/sheriff';
      case 3: return './models/obstacles/terrorist/terrorist';
      case 4: return './models/obstacles/terrorist2/terrorist2';
      case 5: return './models/obstacles/terrorist3/terrorist3';
      case 6: return './models/obstacles/terrorist4/terrorist4';
    }
  }
}