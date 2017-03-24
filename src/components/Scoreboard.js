import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '../actions'
import Shapes from '../utils/Shapes'

class Scoreboard extends React.Component{

  constructor(props){
    super(props)
    this.draw = this.draw.bind(this)
  }

  componentDidMount(){
    this.draw()
  }

  componentDidUpdate(){
    this.draw()
  }

  draw(){
    let blocksize = 40, xpos=10, fontsize = 33, totalLength = 0, buffer=10
    let ctx = document.getElementById('sb').getContext('2d')
    //Initialize transform state
    ctx.setTransform( 1,0,0,1,0,0)
    ctx.clearRect(0,0,this.props.viewWidth, this.props.sbHeight)

    let healthText = ":"+this.props.player.getHealth()
    let weaponText = ":"+this.props.player.getWeapon()
    let armorText = ":"+this.props.player.getArmor()
    let lightText = ":"+this.props.player.getLightSource()
    let expText = "XP: "+this.props.player.getExp()
    let mvText = ": "+this.props.player.getMoves()
    let htLength, wtLength, atLength, ltLength, xpLength, mvLength
    while ( totalLength > this.props.viewWidth || totalLength === 0){
      ctx.font = fontsize-- + "px serif"
      blocksize--
      htLength = ctx.measureText(healthText).width + 10
      wtLength = ctx.measureText(weaponText).width + 10
      atLength = ctx.measureText(armorText).width + 10
      ltLength = ctx.measureText(lightText).width + 10
      xpLength = ctx.measureText(expText).width + 10
      mvLength = ctx.measureText(mvText).width  + 10
      totalLength = 10 + htLength + wtLength + atLength + ltLength + xpLength + mvLength + blocksize*4
    }
    Shapes.drawHeart(ctx, xpos, buffer/2, blocksize)
    ctx.fillStyle = 'white'
    ctx.font = fontsize + 'px serif'
    ctx.textBaseline='middle'
    xpos += blocksize
    ctx.fillText(healthText, xpos, buffer+blocksize/2)
    xpos += htLength
    Shapes.drawWeapon(ctx, xpos, buffer/2, blocksize)
    xpos += blocksize
    ctx.fillStyle = 'white'
    ctx.font = fontsize + 'px serif'
    ctx.textBaseline='middle'
    ctx.fillText(weaponText, xpos, buffer+blocksize/2)
    xpos += wtLength
    Shapes.drawShield(ctx, xpos, buffer/2, blocksize)
    xpos += blocksize
    ctx.fillStyle = 'white'
    ctx.font = fontsize + 'px serif'
    ctx.textBaseline='middle'
    ctx.fillText(armorText, xpos, buffer+blocksize/2)
    xpos += atLength
    Shapes.drawLight(ctx, xpos, buffer/2, blocksize, Math.round(this.props.player.getLightLevel()*.6))
    xpos += blocksize
    ctx.fillStyle = 'white'
    ctx.font = fontsize + 'px serif'
    ctx.textBaseline='middle'
    ctx.fillText(lightText, xpos, buffer+blocksize/2)
    xpos+=ltLength
    Shapes.drawFoot(ctx, xpos, buffer/2, blocksize)
    xpos+=blocksize
    ctx.fillStyle = 'white'
    ctx.font = fontsize + 'px serif'
    ctx.textBaseline='middle'
    ctx.fillText(mvText, xpos-15, buffer+blocksize/2)

  }

  render(){
    let player = this.props.player
    return (
      <div className="scoreboard">
        <canvas id='sb' width={this.props.viewWidth} height={this.props.sbHeight}>
        <div className='data'>Health: {player.health}</div><div className='data'>Weapon: {player.getWeapon()}</div>
        <div className='data'>Armor: {player.getArmor()}</div><div className='data'>Light: {player.getLightSource()}</div>
        <div className='data'>XP: {player.getExp()}</div><div className = 'data'>Moves: {player.getMoves()}</div>
        </canvas>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    player: state.map.player,
    viewWidth: state.map.viewWidth,
    sbHeight: state.map.sbHeight
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(Actions, dispatch)
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard)
