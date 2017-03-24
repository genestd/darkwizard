//thank to http://bigbadwofl.me/random-dungeon-generator/ for inspiration of this code
import {Helpers, Queue} from '../utils/dungeonHelpers'

const Materials = {
  FLOOR: 0,
  CORRIDOR: 1,
  ROOM: 2
}

function Dungeon(config){
  config={
        minWidth: 6,
        minHeight: 15,
        maxWidth: 100,
        maxHeight: 100,
        blocksize: 20,
        monsterDensity: 1,
        roomDensity: 1,
        level: 1
      }
  this.map = null
  this.map_width = config.maxWidth || 100
  this.map_height = config.maxHeight || 100
  this.min_size = config.minWidth || 6
  this.max_size = config.minHeight || 15
  this.rooms = []
  this.blocksize = config.blocksize || 20
  this.setWidth = function(w){
    this.map_width = w
  }
  this.setHeight = function(h){
    this.map_height = h
  }
  this.setMinSize = function(ms){
    this.min_size = ms
  }
  this.setMaxSize = function(ms){
    this.max_size = ms
  }
  this.setMap = function(map){
    this.map = map
  }
  this.setStartX = function(x){
    this.startX = x
  }
  this.setStartY = function(y){
    this.startY = y
  }
  this.getRooms = function(){
    return this.rooms
  }
  this.getHeight = function(){
    return this.map_height
  }
  this.getWidth = function(){
    return this.map_width
  }
  this.getMap = function(){
    return this.map
  }
  this.getMaxSize = function(){
    return this.max_size
  }
  this.getMinSize = function(){
    return this.min_size
  }
  this.addRoom = function(rm){
    this.rooms.push(rm)
  }
  this.getRoom = function(index){
    return this.rooms[index]
  }
  this.getBlocksize = function(){
    return this.blocksize
  }
  this.setBlocksize = function(size){
    this.blocksize = size
  }
  this.generate = function(){
    // start with an empty map,
    // initialize all the cells to unoccupied - "0"
    let newMap = []
    for( let x=0; x<this.getWidth(); x++){
      newMap[x] = []
      for( let y=0; y<this.getHeight(); y++){
        newMap[x][y]={type:Materials.FLOOR, x: x, y: y, visited: false}
      }
    }
    this.setMap(newMap)
    // set a random number of rooms
    // rooms will always be at least 1 cell from the border, and other rooms
    this.rooms = []
    let room_count = Helpers.getRandom(10,20 )
    for( let i=0; i<room_count; i++){
      let room={}
      room.x = Helpers.getRandom(1, this.getWidth() - this.getMaxSize() - 1)
      room.y = Helpers.getRandom(1, this.getHeight() - this.getMaxSize() - 1)
      room.w = Helpers.getRandom(this.getMinSize(), this.getMaxSize() - 1)
      room.h = Helpers.getRandom(this.getMinSize(), this.getMaxSize() - 1)
      room.neighbors=[]
      room.id=i
      if( this.doesCollide(room, i )){
        i--
        continue
      }
      room.w = room.w-2
      room.h = room.h-2
      this.addRoom(room)
    }
    //function to move the rooms as close to center as boundaries will permit.
    this.squashRooms()

    // This section maps corridors between the rooms
    // Starting from center room, it will join all rooms with a 'shared' wall
    // Not all rooms may be joined - traverse step will correct islands
    // The purpose is to miminize long corridors
    let centerRoom = this.findClosestToCenter(this.getRooms())
    this.joinRooms(centerRoom)
    //end of corridor code

    //Traverse the map, and connect any isolated rooms
    this.traverse()
    //iterate through the rooms and mark interiors as occupied - "2"
    for( let i=0; i<this.getRooms().length; i++){
      let room = this.getRoom(i)
      //console.log('Room' + room.id + ' neighbors: ' + room.neighbors)
      for( let j=room.x; j<(room.x+room.w); j++){
        for( let k=room.y; k<(room.y+room.h); k++){
          newMap[j][k].type = Materials.ROOM
        }
      }
    } //end of room filler
    this.minimize();
    //iterate through the whole map, looking for "walls"
    //any cell immediately next to a room or corridor that is unoccupied becomes a wall = "3"
    try {
      for (let x = 0; x < this.map_width; x++) {
        for (let y = 0; y < this.map_height; y++) {
           if (this.map[x][y].type === 2) {
              //console.log('checking: ', x, y)
              for (let xx = x - 1; xx <= x + 1; xx++) {
                  for (let yy = y - 1; yy <= y + 1; yy++) {
                      if (this.map[xx][yy].type === 0) this.map[xx][yy].type=3;
                  }
               }
            }
         }
       }
     } catch (err) {
       console.log(err)
     }
  }

  this.connectRooms = function( roomA, roomB){
    let pointA = Helpers.getCenter(roomA)
    let pointB = Helpers.getCenter(roomB)

    while((pointB.x != pointA.x) || (pointB.y != pointA.y)){
      if(pointB.x != pointA.x){
        if(pointB.x > pointA.x) pointB.x--
        else pointB.x++
      } else if (pointB.y != pointA.y){
        if(pointB.y > pointA.y) pointB.y--
        else pointB.y++
      }
      this.map[pointB.x][pointB.y].type=Materials.CORRIDOR
    }
  }

  //
  this.joinRooms = function(room){
    //First, find the immediate neighbors for the seed room
    let allRooms = this.getRooms()
    let ignore = [room.id]
    let joinQ = new Queue()
    joinQ.enqueue(room.id)
    while (joinQ.size()){
      let node = joinQ.dequeue()
      for(let i=0; i<allRooms.length; i++){
        let nextDoor = false
        if( allRooms[i].id === node) continue
        nextDoor = Helpers.shareWall(allRooms[node], allRooms[i])
        if (nextDoor) {
          //console.log('Room ' + room.id + ' is  ' + nextDoor + ' of ' + allRooms[i].id, allRooms[node], allRooms[i])
          if( allRooms[node].neighbors.indexOf(i) < 0){
            this.buildWall(allRooms[node], allRooms[i],nextDoor)
            allRooms[node].neighbors.push(i)
            allRooms[i].neighbors.push(node)
            if( ignore.indexOf(i) < 0){
              joinQ.enqueue(i)
            }
            ignore.push(i)
          }
        }
      }
    }
    //Next,
  }

  this.buildWall = function(room1, room2, dir){

    let coord = {
      x: null,
      y: null
    }
    switch(dir){
      case "N":
        coord.x = Helpers.getRandom( Math.max(room1.x, room2.x), Math.min(room1.x+room1.w-1, room2.x+room2.w-1) )
        coord.y = room1.y+room1.h
        this.map[coord.x][coord.y].type=Materials.CORRIDOR
        break
      case "S":
        coord.x = Helpers.getRandom( Math.max(room1.x, room2.x), Math.min(room1.x+room1.w-1, room2.x+room2.w-1) )
        coord.y = room1.y - 1
        this.map[coord.x][coord.y].type=Materials.CORRIDOR
        break
      case "E":
        coord.x = room1.x-1
        coord.y = Helpers.getRandom( Math.max(room1.y, room2.y), Math.min(room1.y+room1.h-1, room2.y+room2.h-1) )
        this.map[coord.x][coord.y].type=Materials.CORRIDOR
        break
      case "W":
        coord.x = room1.x + room1.w
        coord.y = Helpers.getRandom( Math.max(room1.y, room2.y), Math.min(room1.y+room1.h-1, room2.y+room2.h-1) )
        this.map[coord.x][coord.y].type=Materials.CORRIDOR
        break
      end
    }
  }
  //checks for overlapping rooms, leave space for walls
  //End of room w&h must be before start of all other rooms w&h
  //Start of room w&h must be after end of all other rooms w&h
  this.doesCollide = function( room, ignore){
    for( let i=0; i<this.rooms.length; i++){
      if( i===ignore) continue
      let check = this.rooms[i]
      if (!((room.x + room.w  < check.x) || (room.x > check.x + check.w ) || (room.y + room.h < check.y) || (room.y > check.y + check.h ))){
        return true
      }
    }
    return false
  }

  //use pythagorean theorem to find room with closest center.  Once
  //2 rooms are joined, we will look for the next closest room.
  //if optional connected array is passed, the function will return the closest connected room.
  this.findClosestRoom = function(rm, connected){
    // otherwise map return the closest corridor.
    let closest = -1
    let dist = this.map_width * this.map_height
    let center = Helpers.getCenter(rm)

    for(let i=0; i<this.rooms.length; i++){
      if (this.rooms[i] === rm || this.rooms[i].neighbors.indexOf(rm.id)>=0 ) continue
      // if the connected array is passed, only return a room that is connected to the main group
      if(connected){
        if (!connected[i]) continue
      }
      let check=this.rooms[i]
      let test = Helpers.getCenter(check)
      let cand = Math.sqrt(Math.pow( Math.abs( center.x - test.x ), 2) + Math.pow( Math.abs( center.y - test.y),2))
      if (cand > 0 && cand < dist){
        dist = cand
        closest = i
      }
    }
    //return if a neighbor exists that hasn't
    //already been identified
    if(closest >= 0){
      //console.log( 'room: ' + rm.id + '. closest room: ' + this.rooms[closest].id + ' : ' + closest)
      rm.neighbors.push(closest)
      this.rooms[closest].neighbors.push(rm.id)
      return this.rooms[closest]

    }
  }

  this.squashRooms = function () {
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < this.rooms.length; j++) {
        var room = this.rooms[j];
        while (true) {
          var old_position = {
              x: room.x,
              y: room.y
          };
          if (room.x + room.w < Math.round(this.map_width/2) ) room.x++;
          if (room.x + room.w > Math.round(this.map_width/2) ) room.x--;
          if (room.y + room.h < Math.round(this.map_height/2)) room.y++;
          if (room.y + room.h > Math.round(this.map_height/2)) room.y--;
          if ((room.x + room.w === Math.round(this.map_width/2)) && (room.y + room.h === Math.round(this.map_height/2))) break;
          if (this.doesCollide(room, j)) {
              room.x = old_position.x;
              room.y = old_position.y;
              break;
          }
        }
      }
    }
  }

  // from an array of rooms, determine which is closes to the center (pythagorean)
  this.findClosestToCenter = function(island){
    let closest = -1,
        dist = this.map_width * this.map_height,
        center = {x: this.map_width/2, y: this.map_height/2}

    for(let i=0;i<island.length;i++){
      let test = Helpers.getCenter(island[i])
      let cand = Math.sqrt(Math.pow( Math.abs( center.x - test.x ), 2) + Math.pow( Math.abs( center.y - test.y),2))
      if (cand > 0 && cand < dist){
        dist = cand
        closest = i
      }
    }
    return island[closest]
  }

  this.traverse = function(){
    //create an array of rooms visited, default to false
    let visited = [],
        q = new Queue(),
        rooms = this.rooms,
        start =  0

    for( let i=0; i<rooms.length; i++){
      visited[i] = false
    }

    //Breadth First Search to see if they're all connected
    visited[start]=true;
    q.enqueue(start)
    while( q.size() > 0){
      let next = q.dequeue()
      for( let i=0; i<rooms[next].neighbors.length; i++){
        if (!visited[rooms[next].neighbors[i]]){
          q.enqueue(rooms[next].neighbors[i])
          visited[rooms[next].neighbors[i]]=true
        }
      }
    }

    //check to see if there are any disconnected rooms
    let connected = true,
        remote = []
    for( let x=0; x<visited.length; x++){
      if (visited[x]===false){
        remote.push(rooms[x])
        connected=false
      }
    }
    //if not all connected, find one unconnected and
    //connect it...then redo the traversal
    //find unconnected room closest to center.
    //connect it to its closest room that is connected to the rest
    if(!connected){
      let connector = this.findClosestToCenter(remote)
      this.joinRooms(connector)
      let endpoint = this.findClosestRoom(connector, visited)
      this.connectRooms( connector, endpoint)
      this.traverse()
    }

  }

  // If rooms were squashed, there is now excess space around the border
  // Resize the map with a one square border
  this.minimize = function(){
    let map = this.getMap(),
      newMap = [],
      rooms = this.getRooms(),
      minX = this.getWidth(),
      minY = this.getHeight(),
      maxX = 0,
      maxY = 0
    for( let i=0; i<rooms.length; i++){
      if (minX > rooms[i].x) minX = rooms[i].x
      if (maxX < rooms[i].x + rooms[i].w) maxX = rooms[i].x + rooms[i].w
      if (minY > rooms[i].y) minY = rooms[i].y
      if (maxY < rooms[i].y + rooms[i].h) maxY = rooms[i].y + rooms[i].h
    }
    //translate current upper left of map to 1,1 (allow for border)
    //adjust each cell by these offsets
    let xOffset = minX-1
    let yOffset = minY-1
    for( let x=0; x<(maxX-minX)+2;x++){
      newMap[x]=[]
      for( let y=0; y<(maxY-minY)+2;y++){
        newMap[x][y]=map[x+xOffset][y+yOffset]
        newMap[x][y].x = x
        newMap[x][y].y = y
        newMap[x][y].type = map[x+xOffset][y+yOffset].type
      }
    }
    this.setWidth( (maxX-minX)+2 )
    this.setHeight( (maxY-minY)+2 )
    this.setMap(newMap)
  }
}

export default Dungeon;
