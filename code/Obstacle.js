class Obstacle extends THREE.Object3D {
  constructor(type) {
    super();
    this.model = this.createObstacle(type);
    this.add(this.model);
  }

  createObstacle(type) {
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