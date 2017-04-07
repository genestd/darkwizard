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

  fitFont(context){
    let block = Math.round(this.props.sbWidth/4),
        fontsize = this.props.sbWidthsbWidth > 700 ? 32 : 24,
        allText = [this.props.player.getHealth(), this.props.player.getWeapon(), this.props.player.getArmor(),
                this.props.player.getMoves(), this.props.player.getLightSource()],
        longest=0,
        checkText=''

        for(let i=0; i<allText.length;i++){
          if(allText[i].length > longest){
            longest = allText[i].length
            checkText = allText[i]
          }
        }
        context.font = fontsize + "px serif"
    let textLength = context.measureText(checkText).width
    context.font = fontsize + "px serif"
    while(textLength > block){
      fontsize--
      context.font = fontsize + "px serif"
      textLength = context.measureText(checkText).width
    }
    return fontsize
  }

  getOffset(ctx, text, size){
    let textLength = ctx.measureText(text).width
    return Math.round( ((this.props.sbWidth/16 * size) - textLength)/2)
  }


  draw(){
    console.log('viewwidth: ', this.props.sbWidth)
    let blocksize = 40, xpos=10, fontsize = 33, totalLength = 0, buffer=10, textProps = {}, blockWidth=Math.round(this.props.sbWidth/16)
    let ctx = document.getElementById('sb').getContext('2d')
    if( this.props.sbWidth < 400) blocksize=30
    //Initialize transform state
    ctx.setTransform( 1,0,0,1,0,0)
    ctx.clearRect(0,0,this.props.sbWidth, this.props.sbHeight)

    Shapes.drawWeapon(ctx, blockWidth*2-blocksize/2, buffer/2, blocksize)
    Shapes.drawHeart(ctx, blockWidth*4, buffer/2, blocksize)
    Shapes.drawShield(ctx, blockWidth*7, buffer/2, blocksize)
    Shapes.drawFoot(ctx, blockWidth*10-blockWidth/4, buffer/2, blocksize)
    Shapes.drawLight(ctx, blockWidth*12.5, buffer/2, blocksize, Math.round(this.props.player.getLightLevel()*.6))

    ctx.fillStyle = 'white'
    ctx.font =  this.fitFont(ctx) + 'px serif'
    ctx.textBaseline='top'
    ctx.fillText(this.props.player.getWeapon(), this.getOffset(ctx, this.props.player.getWeapon(), 4), buffer/2+blocksize)
    ctx.fillText(this.props.player.getHealth(), blockWidth*3.5+this.getOffset(ctx, this.props.player.getHealth(), 2), buffer/2+blocksize)
    ctx.fillText(this.props.player.getArmor(), blockWidth*5.5+this.getOffset(ctx, this.props.player.getArmor(), 4), buffer/2+blocksize)
    ctx.fillText(this.props.player.getMoves(), blockWidth*9+this.getOffset(ctx, this.props.player.getMoves(), 2), buffer/2+blocksize)
    ctx.fillText(this.props.player.getLightSource(), blockWidth*11+this.getOffset(ctx, this.props.player.getLightSource(), 4), buffer/2+blocksize)

/*    textProps = this.initText(ctx,this.props.player.getWeapon(), 2)
    if (textProps.fontSize < fontsize) fontsize=textProps.fontSize
    ctx.font =  textProps.fontSize + 'px serif'
    xpos += blockWidth

    textProps = this.initText(ctx,this.props.player.getArmor(), 2)
    if (textProps.fontSize < fontsize) fontsize=textProps.fontSize
    ctx.font =  textProps.fontSize + 'px serif'
    ctx.fillText(this.props.player.getArmor(), xpos, buffer+blocksize)
    xpos += blockWidth

    textProps = this.initText(ctx,this.props.player.getLightSource(),2)
    if (textProps.fontSize < fontsize) fontsize=textProps.fontSize
    ctx.font =  textProps.fontSize + 'px serif'
    ctx.fillText(this.props.player.getLightSource(), xpos, buffer+blocksize)
    xpos += blockWidth

    textProps = this.initText(ctx,this.props.player.getMoves(), 1)
    ctx.font =  textProps.fontSize + 'px serif'
    ctx.fillText(this.props.player.getMoves(), xpos, buffer+blocksize)*/
  }

  render(){
    let player = this.props.player
    return (
      <div className="scoreboard">
        <canvas id='sb' width={this.props.sbWidth} height={this.props.sbHeight}>
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
    sbWidth: state.map.sbWidth,
    sbHeight: state.map.sbHeight,
    blocksize: state.map.blocksize
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(Actions, dispatch)
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard)
