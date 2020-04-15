class Environment extends THREE.Object3D {
  constructor(mapa = 1) {
    super();

    var materialArray = [];

    var url = mapa == 1 ? 'imgs/ci_' : 'imgs/barren_';

    var texture_ft = new THREE.TextureLoader().load( url + 'ft.jpg');
    var texture_bk = new THREE.TextureLoader().load( url + 'bk.jpg');
    var texture_up = new THREE.TextureLoader().load( url + 'up.jpg');
    var texture_dn = new THREE.TextureLoader().load( url + 'dn.jpg');
    var texture_rt = new THREE.TextureLoader().load( url + 'rt.jpg');
    var texture_lf = new THREE.TextureLoader().load( url + 'lf.jpg');
      
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
       
    for (var i = 0; i < 6; i++)
      materialArray[i].side = THREE.BackSide;
       
    var boxGeo = new THREE.BoxBufferGeometry( 200, 200, 200);
    var box = new THREE.Mesh( boxGeo, materialArray );
    
    this.add( box );
    
  }
}