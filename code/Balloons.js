
class Balloons extends THREE.Object3D {

  constructor(radio) {
    super();

    this.velocidad = 0;

    this.ball = this.createBalloon(radio);

    this.setPosition();

    this.add(this.ball);
  }

  createBalloon(radio) {
    var ballTexture = new THREE.TextureLoader().load("imgs/balloons.png");
    var ballMaterial = new THREE.MeshPhongMaterial({ map: ballTexture });
    var ballGeo = new THREE.SphereGeometry(radio);
    var ball = new THREE.Mesh(ballGeo, ballMaterial);

    return ball;
  }

  //Calcula la posicion donde se creará el globo
  setPosition() {
    var posX = this.getRandom(-100, 100);
    var posZ = this.getRandom(-100, 100);
    this.ball.position.set(posX, -103, posZ);
    this.ball.castShadow = true;
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  update() {
    this.velocidad = this.getRandom(0, 0.5);

    this.ball.position.y += this.velocidad;

    if (this.ball.position.y > 100) { //Aqui controlare si se ha picado, que aparezca de nuevo
      this.setPosition();
    }
  }
}
