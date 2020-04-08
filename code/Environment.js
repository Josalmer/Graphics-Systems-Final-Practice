class Environment extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();

    var materialArray = [];
    var texture_ft = new THREE.TextureLoader().load( 'imgs/ci_ft.jpg');
    var texture_bk = new THREE.TextureLoader().load( 'imgs/ci_bk.jpg');
    var texture_up = new THREE.TextureLoader().load( 'imgs/ci_up.jpg');
    var texture_dn = new THREE.TextureLoader().load( 'imgs/ci_dn.jpg'); //suelo
    var texture_rt = new THREE.TextureLoader().load( 'imgs/ci_rt.jpg');
    var texture_lf = new THREE.TextureLoader().load( 'imgs/ci_lf.jpg');
      
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
       
    for (var i = 0; i < 6; i++)
      materialArray[i].side = THREE.BackSide;
       
    var skyboxGeo = new THREE.BoxGeometry( 200, 200, 200);
    var skybox = new THREE.Mesh( skyboxGeo, materialArray );
    
    this.add( skybox );
    
  }

  update () {

  }
}