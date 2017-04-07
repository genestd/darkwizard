import {Helpers} from '../utils/dungeonHelpers'

const weapons = [
  { name: 'Rock',
    damage: 10 },
  { name: 'Rusty Knife',
    damage: 15 },
  { name: 'Iron Mace',
    damage: 20 },
  { name: 'Long Bow',
    damage: 25 },
  { name: 'Warhammer',
    damage: 30},
  { name: 'Gorloch\'s Trident',
    damage: 30},
  { name: 'Widowmaker',
    damage: 35},
  { name: 'Valyrian Steel',
    damage: 35},
]
const armor = [
  { name: 'None',
    protection: 0 },
  { name: 'Helmet',
    protection: 5 },
  { name: 'Shield',
    protection: 10},
  { name: 'Leather Vest',
    protection: 15},
  { name: 'Chain Mail',
    protection: 20 },
  { name: 'Enchanted Gloves',
    protection: 25 },
  { name: 'Invisibility Cloak',
    protection: 25 }
]
const lights = [
  { name: 'Candle',
    strength: 40},
  { name: 'Torch',
    strength: 55},
  { name: 'Lantern',
    strength: 70},
  { name: 'Glowing Orb',
    strength: 85},
  { name: 'Phosphorescent Rock',
    strength: 90},
  { name: 'Sun Bolt',
    strength: 100}
]
function Player(){

  this.health=20
  this.experience=0
  this.weapon=0
  this.armor=0
  this.level=1
  this.location= { x: 10,
              y: 10
            }
  this.light=0
  this.moves=0
  this.getHealth = function(){
    return this.health
  }
  this.damage = function(dam){
    dam -= (armor.protection * this.level);
    this.health = this.health - dam
  }
  this.heal = function(healing){
    this.health = this.health + heal
  }
  this.attack = function(){
    let hit = Helpers.getRandom( 0, weapons[this.weapon].damage + this.level)
    return hit
  }
  this.getExp = function(){
    return this.experience
  }
  this.setExp = function(xp){
    this.experience += xp
  }
  this.getWeapon = function(){
    if (this.weapon >= weapons.length){
      this.weapon = weapons.length-1
    }
    return weapons[this.weapon].name
  }
  this.setWeapon = function(w){
    this.weapon = w
  }
  this.getArmor = function(){
    if(this.armor >= armor.length){
      this.armor=armor.length-1
    }
    return armor[this.armor].name
  }
  this.setArmor = function(a){
    this.armor = a
  }
  this.getLevel = function(){
    return this.level
  }
  this.setLevel = function(){
    this.level++
  }
  this.getLocation = function(){
    return this.location
  }
  this.setLocation = function(loc){
    this.location = loc
  }
  this.getLightSource = function(){
    if(this.light>=lights.length){
      this.light=lights.length-1
    }
    return lights[this.light].name
  }
  this.getLightLevel = function(){
    return lights[this.light].strength
  }
  this.alive = function(){
    return (this.health > 0)
  }
  this.getMoves = function(){
    return this.moves
  }
}
export default Player
export {weapons, armor}
