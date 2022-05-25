class Cube {
  constructor(options = {}) {
    this.x = (options.position) ? (options.position.x) || 0 : 0;
    this.y = (options.position) ? (options.position.y) || 0 : 0;
    this.z = (options.position) ? (options.position.z) || 0 : 0;

    this.rx = (options.rotation) ? (options.rotation.x) || 0 : 0;
    this.ry = (options.rotation) ? (options.rotation.y) || 0 : 0;
    this.rz = (options.rotation) ? (options.rotation.z) || 0 : 0;

    this.sx = (options.scale) ? (options.scale.x) || 1 : 1;
    this.sy = (options.scale) ? (options.scale.y) || 1 : 1;
    this.sz = (options.scale) ? (options.scale.z) || 1 : 1;

    this.geometry = new THREE.BoxGeometry(this.sx, this.sy, this.sz);
    this.material = new THREE.MeshStandardMaterial(options.material);
    if(options.texture) {
      this.material.map = new THREE.TextureLoader().load("assets/images/"+options.texture+".png");
      this.material.map.repeat.set(this.sx, this.sy);
      this.material.map.minFilter = THREE.NearestFilter;
      this.material.map.magFilter = THREE.NearestFilter;
      this.material.map.wrapS = THREE.RepeatWrapping;
      this.material.map.wrapT = THREE.RepeatWrapping;
      this.material.map.offset.set(Math.random() * 10, Math.random() * 10);
    }
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.rotation.set(this.rx, this.ry, this.rz);
    scene.add(this.mesh);
  }
}
