class Cell {
  constructor(x, y, imageIndex) {
    this.x = x;
    this.y = y;

    this.isUsed = false;
    
    this.image = new Image();
    this.image.src = "assets/tiles.png";
    this.imageIndex = imageIndex%Cell.tiles.length;
    this.sides = Cell.tiles[this.imageIndex];
    this.neighborLists = {
      posX: [],
      posY: [],
      negX: [],
      negY: []
    };

    this.colors = ["red", "coral", "yellow", "lightgreen", "blue", "dodgerblue", "purple", "pink", "saddlebrown", "grey"]
    this.gltf = undefined;
    
    for(let i = 0; i < Cell.tiles.length; i++) {
      let tile = Cell.tiles[i];
      if(this.sides.negX === tile.posX) {
        this.neighborLists.negX.push(i);
      }
      if(this.sides.posX === tile.negX) {
        this.neighborLists.posX.push(i);
      }
      if(this.sides.negY === tile.posY) {
        this.neighborLists.negY.push(i);
      }
      if(this.sides.posY === tile.negY) {
        this.neighborLists.posY.push(i);
      }
    }
  }
  addMesh() {
    const scope = this;
    const loader = new THREE.GLTFLoader();
    loader.load("assets/Tiles/tile" + this.imageIndex + ".gltf", function(gltf) {
      scope.gltf = gltf.scene;
      scope.gltf.scale.set(5, 5, 5);
      scope.gltf.position.set(scope.x, 0.5, scope.y);
      scope.gltf.name = Math.random() * 1000;
      scene.add(gltf.scene);
    });
  }
  static tiles = [
    {posX: 1, negX: 1, posY: 0, negY: 0}, // 0
    {posX: 0, negX: 0, posY: 1, negY: 1}, // 1
    {posX: 1, negX: 1, posY: 1, negY: 1}, // 2
    {posX: 1, negX: 0, posY: 0, negY: 1}, // 3
    {posX: 0, negX: 1, posY: 0, negY: 1}, // 4
    {posX: 0, negX: 1, posY: 1, negY: 0}, // 5
    {posX: 1, negX: 0, posY: 1, negY: 0}, // 6
    {posX: 1, negX: 1, posY: 1, negY: 0}, // 7
    {posX: 1, negX: 0, posY: 1, negY: 1}, // 8
    {posX: 1, negX: 1, posY: 0, negY: 1}, // 9
    {posX: 0, negX: 1, posY: 1, negY: 1}, // 10
    {posX: 0, negX: 0, posY: 0, negY: 0}, // 11
  ];
  static NearestCells(x, y) {
    let nearest = [];
    for(let cell of cells) {
      if(Distance(x, y, cell.x, cell.y) === seperationSize) {
        nearest.push(cell);
      }
    }
    return nearest;
  }
}

