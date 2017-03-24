import Monster from '../utils/Monster'

const Helpers = {
  // Random number generator used all over the place
  getRandom: function(min, max){
    let rndm = Math.round(Math.random()*(max-min)) + min
    return rndm
  },

  // returns the center point of a square, given object
  // with x,y and width/height
  // used when measuring distances, or connecting distant rooms
  getCenter: function( room ){
    let center = {
      x: Math.floor(room.x+(room.w/2)),
      y: Math.floor(room.y+(room.h/2))
    }
    return center
  },

  // check if the two rooms share a wall
  // return direction of room2 in relation to room1, or null
  // used for connecting rooms with a shared wall
  shareWall: function(room1, room2){
    let dir = null
    //above
    if ((room2.y+room2.h+1 === room1.y) && ((room2.x===room1.x && room2.x+room2.w === room1.x+room1.w) || (room2.x > room1.x && room2.x < room1.x + room1.w) || (room2.x+room2.w > room1.x && room2.x+room2.w < room1.x + room1.w) || (room1.x > room2.x && room1.x < room2.x + room2.w) || (room1.x+room1.w > room2.x && room1.x+room1.w < room2.x + room2.w)))
      { dir="S" }
    //below
    if ((room2.y === room1.y+room1.h+1) && ((room2.x===room1.x && room2.x+room2.w === room1.x+room1.w) || (room2.x > room1.x && room2.x < room1.x + room1.w) || (room2.x+room2.w > room1.x && room2.x+room2.w < room1.x + room1.w) || (room1.x > room2.x && room1.x < room2.x + room2.w) || (room1.x+room1.w > room2.x && room1.x+room1.w < room2.x + room2.w)))
      { dir="N" }
      //left
    if ((room2.x+room2.w+1 === room1.x) && ((room2.y===room1.y && room2.y+room2.h === room1.y+room1.h) || (room2.y > room1.y && room2.y < room1.y + room1.h) || (room2.y+room2.h > room1.y && room2.y+room2.h < room1.y + room1.h) || (room1.y > room2.y && room1.y < room2.y + room2.h) || (room1.y+room1.h > room2.y && room1.y+room1.h < room2.y + room2.h)))
      { dir="E" }
    // right
    if ((room2.x === room1.x+room1.w+1) && ((room2.y===room1.y && room2.y+room2.h === room1.y+room1.h) || (room2.y > room1.y && room2.y < room1.y + room1.h) || (room2.y+room2.h > room1.y && room2.y+room2.h < room1.y + room1.h) || (room1.y > room2.y && room1.y < room2.y + room2.h) || (room1.y+room1.h > room2.y && room1.y+room1.h < room2.y + room2.h)))
      { dir="W" }
    return dir
  },

  //given a dungeon, this function will return the location of a cell with "ROOM" type
  getOpenCellInMap: function(d){
    let w = d.getWidth()
    let h = d.getHeight()

    let notPlaced = true
    let location = {}
    while (notPlaced){
      let testX = this.getRandom( 0, w-1 )
      let testY = this.getRandom( 0, h-1 )
      if( d.map[testX][testY].type === 2 ){
        location.x = testX
        location.y = testY
        notPlaced = false
      }
    }
    return location
  },

  populateDungeon: function(level, dungeon){
    let monsters = this.getRandom(level, dungeon.getRooms().length/1.5)
    let food = this.getRandom(level, dungeon.getRooms().length/1.5)
    let things=[], loc = {}, placed=false

    // Add some random monsters
    for( let i=0; i<monsters; i++){
      placed=false
      while (!placed){
        loc = this.getOpenCellInMap(dungeon)
        for( let j=0; j<things.length; j++){
          if(things[j].location.x != loc.x || things[j].location.y != loc.y){
            placed=true
          }
        }
        let mon = new Monster(level)

        things.push( { type: 5, location: loc, monster: mon})
      }
    }
    // Add some random food
    for( let i=0; i<food; i++){
      placed = false
      while (!placed){
        loc = this.getOpenCellInMap(dungeon)
        for( let j=0; j<things.length; j++){
          if(things[j].location.x != loc.x || things[j].location.y != loc.y){
            placed=true
          }
        }
      }
      things.push( { type: 6, location: loc })
    }
    // Add a weapon
    placed = false
    while (!placed){
      loc = this.getOpenCellInMap(dungeon)
      for( let j=0; j<things.length; j++){
        if(things[j].location.x != loc.x || things[j].location.y != loc.y){
          placed=true
        }
      }
    }
    things.push( { type: 7, location: loc})
    // Add Armor
    placed = false
    while (!placed){
      loc = this.getOpenCellInMap(dungeon)
      for( let j=0; j<things.length; j++){
        if(things[j].location.x != loc.x || things[j].location.y != loc.y){
          placed=true
        }
      }
    }
    things.push( { type: 8, location: loc} )
    // Add a light source
    placed = false
    while (!placed){
      loc = this.getOpenCellInMap(dungeon)
      for( let j=0; j<things.length; j++){
        if(things[j].location.x != loc.x || things[j].location.y != loc.y){
          placed=true
        }
      }
    }
    things.push( { type: 9, location: loc} )
    // Add a boss
    placed = false
    while (!placed){
      loc = this.getOpenCellInMap(dungeon)
      for( let j=0; j<things.length; j++){
        if(things[j].location.x != loc.x || things[j].location.y != loc.y){
          placed=true
        }
      }
    }
    let mon = new Monster(level)
    mon.hp = mon.hp * 2
    mon.name = "Boss " + mon.name
    things.push( { type: 10, location: loc, monster: mon} )
    return things
  },

  /* deprecated functions
  //determine cardinal direction from one point to another
  getDir: function(point1, point2){
    let ns='', ew=''
    if (point1.x > point2.x) ew="W"
    if (point1.x < point2.x) ew="E"
    if (point1.y > point2.y) ns="N"
    if (point1.y < point2.y) ns="S"

    let dir=ns+ew
    return ns+ew
  },*/

}

function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}

Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

Queue.prototype.dequeue = function() {

    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;
    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;

        return deletedData;
    }
};
export {Queue}
export {Helpers}
