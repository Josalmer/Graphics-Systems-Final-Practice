class Rail extends THREE.Object3D {
  constructor(spline, mapa = 1) {
    super();
    this.mesh = this.createMesh(spline, mapa);
    this.add(this.mesh);
  }

  createMesh(spline, mapa) {
    // TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
    var geometry = new THREE.TubeBufferGeometry(spline, 512, 0.7, 12, true);
    // Definir aquí el material de las guías
    let texture = mapa == 1 ? 'imgs/tubo1.jpg' : 'imgs/madera1.jpg';
    var textureRail = new THREE.TextureLoader().load(texture);
    var material = new THREE.MeshPhongMaterial({ map: textureRail });
    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }
}