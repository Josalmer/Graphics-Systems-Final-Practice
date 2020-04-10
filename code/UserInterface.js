class UserInterface extends THREE.Object3D {
  constructor() {
    super();

    this.userData = this.initUI();
  }

  initUI() {
    var userInt = {
      showInitMenu: true,
      showHelpMenu: true,
    };
    return userInt;
  }
}