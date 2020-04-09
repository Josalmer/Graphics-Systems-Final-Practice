class Rail extends THREE.Object3D {
  constructor(spline) {
    super();
    this.mesh = this.createMesh(spline);
    this.add(this.mesh);
  }

  createMesh(spline) {
    // TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
    var geometry = new THREE.TubeGeometry(spline, 512, 0.7, 12, true);
    // Definir aquí el material de las guías
    var textureRail = new THREE.TextureLoader().load('imgs/tubo1.jpg');
    var material = new THREE.MeshBasicMaterial({ map: textureRail });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }
}