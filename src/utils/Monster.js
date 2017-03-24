import {Helpers} from '../utils/dungeonHelpers'
const names = ['Orc', 'Goblin', 'Grue', 'Giant Slug', 'Ghost', 'Cave Bat', 'Zombie', 'Slime Mold', 'Skeleton', 'Carnivorous Vine']
function Monster(lvl=1){

  this.hp = Helpers.getRandom( 0, lvl*10+20)
  this.xpValue = this.hp
  this.strength = Helpers.getRandom( lvl*3+10, lvl*6+20)
  this.name = names[Helpers.getRandom(0,9)]
  this.level = lvl

  this.attack = function(){
    return Helpers.getRandom(0, this.strength)
  }
  this.takeDamage = function(dam){
    this.hp -= dam
  }
  this.alive = function(){
    if (this.hp > 0){
      return true
    }
    return false
  }
  this.getHP = function(){
    return this.hp
  }
  this.getXPValue = function(){
    return this.xpValue
  }
  this.getStrength = function(){
    return this.strength
  }
}

export default Monster
