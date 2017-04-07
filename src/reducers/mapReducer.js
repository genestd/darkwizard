//import actions
import update from 'immutability-helper'
import {Helpers} from '../utils/dungeonHelpers'
import {GENERATE_LEVEL, MOVE_PLAYER, UPDATE_DIMENSIONS, RESET_MESSAGE, TOGGLE_DARKNESS,
        SET_ROOM_DENSITY, SET_MONSTER_DENSITY, SET_TILE_SIZE} from '../actions'
import Dungeon from '../utils/Dungeon'
import Player from '../utils/Player'
import Monster from '../utils/Monster'
let myPlayer = new Player()

const INITIAL_STATE = setDefaults(1)
function setDefaults(lvl){
  let config={
        minWidth: 6,
        minHeight: 15,
        maxWidth: 100,
        maxHeight: 100,
        blocksize: 20,
        monsterDensity: 1,
        roomDensity: 1,
        level: 1
      }

  let dungeon = new Dungeon(config)
  dungeon.generate()
  myPlayer.location = Helpers.getOpenCellInMap(dungeon)
  let base =
  {
    mapWidth: dungeon.getWidth(),
    mapHeight: dungeon.getHeight(),
    blocksize: dungeon.getBlocksize(),
    map: dungeon.map,
    level: lvl,
    player: myPlayer,
    occupants: Helpers.populateDungeon( lvl, dungeon ),
    viewWidth: 320,
    viewHeight: 450,
    sbHeight: 80,
    sbWidth: 320,
    message: 'You are in a dark maze. Your only escape is to find the Sun Bolt',
    gameover: false,
    levelComplete: false,
    darkness: true,
    monsterDensity: 1,
    roomDensity: 1
  }
  return base
}

function checkDest(dest, occupants, state){
  let block = 0
  let remove
  for(let i=0; i<occupants.length; i++){
    if( occupants[i].location.x === dest.x && occupants[i].location.y === dest.y){
      block = occupants[i].type
      remove = i
    }
  }
  switch(block){
    // Moved to empty space
    case 0:
      state = markVisited(state, dest)
      return update(state, {
        player: {location: {$set: dest}},
      })
    // Ran into a monster or boss
    case 5:
    case 10:
      let result = fight(state.player, occupants[remove].monster)

      if (result.monsterDead){
        if( block === 10){
           if( result.darkwizard){
             result.message += "You won the game!"
           } else {
             result.message += "You finished the level!"
           }
           state = update(state, {
                            levelComplete: {$set: true},
                            darkness: {$set: false},
                            gameover: {$set: result.darkwizard}
                              })
        }
        state = markVisited(state, dest)
        return update(state, {
          player: {experience: {$apply: function(x){return x + result.playerXP }},
                   location: {$set: dest}},
          occupants: {$splice: [[remove, 1]]},
          message: {$set: result.message}
        })
      } else if (result.playerDead){
          return update(state, {
            player: {health: {$set: 0}},
            message: {$set: result.message},
            gameover: {$set: true}
          })

      } else {
          return update(state, {
            player: {health: {$apply: function(x){return x - result.mAttack}}},
            message: {$set: result.message},
            occupants: {$splice: [[remove, 1, {type:block, location: dest, monster:result.monster}]]}
          })
      }
      break
    // Found some food
    // Update player, remove food from map
    case 6:
      state = markVisited(state, dest)
      return update(state, {
        player: {health: {$apply: function(x) {return x + 20}},
                 location: {$set: dest}},
        occupants: {$splice: [[remove, 1]]},
        message: {$set: "You ate some food.  Health +20"}
      })
      break
    // Found a weapon
    // Update Player, remove weapon from map
    case 7:
      state = markVisited(state, dest)
      state =  update(state, {
        player: {weapon: {$apply: function(x) {return x + 1}},
                location: {$set: dest}},
        occupants: {$splice: [[remove, 1]]}
      })
      return update(state, {
        message: {$set: "You found a " + state.player.getWeapon()}
      })
      break
    // Found armor
    // Update player, remove armor from map
    case 8:
      state = markVisited(state, dest)
      state = update(state, {
        player: {armor: {$apply: function(x) {return x + 1}},
                 location: {$set: dest}},
        occupants: {$splice: [[remove, 1]]}
      })
      return update(state, {
        message: {$set: "You found a " + state.player.getArmor()}
      })
      break
    // Found light
    // Update player, remove light from map
    case 9:
      state = markVisited(state, dest)
      state = update(state, {
        player: {light: {$apply: function(x) {return x + 1}},
                 location: {$set: dest}},
        occupants: {$splice: [[remove, 1]]}
      })
      if( state.player.getLightSource() === 'Sun Bolt'){
        let boss = new Monster(state.player.getLevel())
        boss.name = 'Dark Wizard'
        let newOcc = {type: 10, location: state.occupants[state.occupants.length-1].location, monster: boss}
        return update(state, {
          message: {$set: "You've found the Sun Bolt! Defeat the Dark Wizard to escape the dungeon!"},
          occupants: {$splice: [[occupants.length-1,1, newOcc]]}
        })

      } else
      return update(state, {
        message: {$set: "You found a " + state.player.getLightSource()}
      })
      break
    // Unknown
    default:
      console.log('HMMMM')
      break;
  end
  }
}

const mapReducer = function( state=INITIAL_STATE, action){
  let newState = Object.assign({}, state)
  switch( action.type ){

    case GENERATE_LEVEL:
      let dun = new Dungeon()
      dun.setWidth( state.mapWidth)
      dun.setWidth( state.mapHeight)
      dun.generate()
      let newOcc = Helpers.populateDungeon( state.level+1, dun )
      newState = update( state, {
        map: {$set: dun.map},
        occupants: {$set: newOcc},
        mapWidth: {$set: dun.getWidth()},
        mapHeight: {$set: dun.getHeight()},
        levelComplete: {$set: false},
        player: {location: {$set: Helpers.getOpenCellInMap(dun)}},
        level: {$set: state.level+1},
        darkness: {$set: true}
      })

      return newState

    case MOVE_PLAYER:
      let orig = state.player.location
      let dest = {
        x: state.player.location.x + action.payload.x,
        y: state.player.location.y + action.payload.y
      }
      let destType = state.map[dest.x][dest.y].type
      if( destType === 2 || destType === 1){
        newState = checkDest(dest, state.occupants, state)
      }
      return newState

    case UPDATE_DIMENSIONS:
      let mapW = state.mapWidth * state.blocksize
      let mapH = state.mapHeight * state.blocksize
      let w = (mapW < action.payload.width ? mapW : action.payload.width)
      let h = (mapH < action.payload.height ? mapH : action.payload.height)
      newState = update(state, {
        viewWidth: {$set: w},
        viewHeight: {$set: h-110},
        sbWidth: {$set: action.payload.width}
      })
      if (action.payload.width < 500){
        newState=update(newState, {
          blocksize: {$set: 15}
        })
      }
      return newState

    case RESET_MESSAGE:
      newState = update(state, {
        message: {$set: ""}
      })
      return newState

    case TOGGLE_DARKNESS:
      let d = action.payload>0 ? true : false
      newState = update(state, {
        darkness: {$set: d}
      })
      return newState

    case SET_MONSTER_DENSITY:
      newState = update(state, {
        monsterDensity: {$set: action.payload}
      })
      return newState

    case SET_ROOM_DENSITY:
      newState = update(state, {
        roomDensity: {$set: action.payload}
      })
      return newState

    case SET_TILE_SIZE:
      newState = update(state, {
        blocksize: {$set: action.payload}
      })
      return newState
    default:
      return Object.assign({}, state)
  }
}

function markVisited(state, dest){

  let row = state.map[dest.x]
  let cell = { type: row[dest.y].type,
                  x: row[dest.y].x,
                  y: row[dest.y].y,
            visited: true}
  row = update(row, {
    $splice: [[dest.y, 1, cell]]
  })
  state = update(state, {
    map: {$splice: [[dest.x, 1, row]]},
    player: {moves: {$apply: function(x){return x+1}}}
  })
  return state
}

function fight(player, m){
  let response = {}
  let monster = Object.assign({}, m)
  console.log(monster, player.getLightSource())
  response.monster=monster
  response.darkwizard = (player.getLightSource() === 'Sun Bolt' ? true : false)
  //Player attacks
  let pAttack = player.attack()
  response.pAttack = pAttack
  if (pAttack > 0){
    //If hit, check results
    response.message = 'You hit the ' + monster.name + ': (-' + pAttack + ') '
    if(monster.getHP() <= pAttack){
      response.playerXP = monster.getXPValue()
      response.message = 'The ' + monster.name + ' dies! You gain ' + monster.getXPValue() + ' experience. '
      response.monsterDead = true
      return response
    //put a new monster object in the response
    } else {
      response.monster.hp = monster.getHP() - pAttack
    }
  } else {
    response.message = 'Your attack misses! '
  }
  //Monster attacks
  let mAttack = monster.attack()
  response.mAttack = mAttack
  if (mAttack === 0){
    response.message += 'The ' + monster.name + ' misses you. '
  } else {
    if (mAttack >= player.getHealth()){
      response.message += 'The ' + monster.name + ' hits you!  You\'ve been killed by a ' + monster.name + '! '
      response.playerDead = true
    } else {
      response.message += 'The ' + monster.name + ' hits you! '
    }
  }
  return response
}

export default mapReducer
