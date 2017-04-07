import React from 'react'
import * as Actions from '../actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Shapes from '../utils/Shapes'
import touchEvent from '../utils/touchEvent'
import Scoreboard from '../components/Scoreboard'
import Snackbar from '../components/Snackbar'
import SettingsContainer from '../components/SettingsContainer'
import Splash from '../components/Splash'

class Map extends React.Component{

  constructor(props){
    super(props)
    this.keypressEvent = this.keypressEvent.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.draw = this.draw.bind(this)
    this.state = {
      up: '',
      down: '',
      left: '',
      right: '',
      timer: 0,
      isTouched: false
    }
  }

  updateDimensions() {
    let w=window,
    d = document,
    documentElement = d.documentElement,
    body = d.getElementsByTagName('body')[0],
    winWidth = w.innerWidth || documentElement.clientWidth || body.clientWidth,
    winHeight = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
    this.props.actions.updateDimensions(
      {width: winWidth,
       height: winHeight
      }
    );
  }
  //bind eventlisteners to keys
  componentWillMount(){
    document.addEventListener('keydown', this.keypressEvent)
    window.addEventListener('resize', this.updateDimensions)
    this.updateDimensions()
  }

  //remove eventListers
  componentWillUnmount(){
    document.removeEventListener('keydown', this.keypressEvent)
    document.removeEventListener('resize', this.updateDimensions)
  }

  componentDidMount(){
    this.updateDimensions()
    this.draw()
  }

  componentDidUpdate(){
    this.draw()
  }

  handleTouch(e){
    if(this.props.splash) return
    e.preventDefault()


    let id = e.target.id
      , vector={}
      , timer = 0
      , now = new Date().getTime()
    this.setState({ [id]: id + '-push ',
                     isTouched: true })
    switch(id){
      case 'up':
        vector = {x:0, y:-1}
        this.props.actions.movePlayer(vector)
        break
      case 'down':
        vector = {x:0, y:1}
        this.props.actions.movePlayer(vector)
        break
      case 'left':
        vector = {x:-1, y:0}
        this.props.actions.movePlayer(vector)
        break
      case 'right':
        vector = {x:1, y:0}
        this.props.actions.movePlayer(vector)
        break
      default:
        console.log('handleTouch error')
    }
    //wait 150ms.  if still touched, start the interval timer
    window.setTimeout(function(){
      if(this.state.isTouched){
        timer = window.setInterval( function(timer){
          if(this.state.isTouched){
            this.props.actions.movePlayer(vector)
          } else {
            window.clearInterval(timer)
          }
        }.bind(this),150)
        this.setState({timer: timer})
      }
   }.bind(this), 150)

  }

  handleTouchEnd(e){
    e.preventDefault()
    let id = e.target.id
    this.setState({ [id]: '',
                    isTouched: false})
    window.clearInterval(this.state.timer)
  }

  keypressEvent(e){
    if (this.props.splash) return
    if (!this.props.gameover && !this.props.levelComplete){
      switch(e.which){
        case 37:
          this.props.actions.movePlayer({x:-1, y:0})
          e.preventDefault()
          break
        case 38:
          this.props.actions.movePlayer({x:0, y:-1})
          e.preventDefault()
          break
        case 39:
          this.props.actions.movePlayer({x:1, y:0})
          e.preventDefault()
          break
        case 40:
          this.props.actions.movePlayer({x:0, y:1})
          e.preventDefault()
          break
      end
      }
    }
  }

  draw(){

    //               0=BLACK           1=FORESTGREEN       2=STEELBLUE               3=STONE                4=RED          5=SADDLEBROWN         6=PINK               7=GOLD               8=SILVER
    const COLORS = ['rgba(0,0,0,1)', 'rgba(0,100,0,1)', 'rgba(70,130,180,1)', 'rgba(139,141,122,1)', 'rgba(255,0,0,1)', 'rgba(139,69,19,1)', 'rgba(255,102,178)', 'rgba(255,215,0,1)', 'rgba(192,192,192,1)']
    const STROKES = ['rgba(0,0,0,1)','rgba(180,180,180,.25)','rgba(180,180,180,.25)','rgba(100,100,100,.25)']
    let blox = this.props.blocksize

    let ctx = document.getElementById('dungeon0').getContext('2d')
    let ctxTop = document.getElementById('dungeon1').getContext('2d')
    let scale = 1

    //Clear previous drawing
    ctx.clearRect(0,0,this.props.mapWidth * blox,this.props.mapHeight * blox)
    ctxTop.clearRect(0,0,this.props.mapWidth * blox,this.props.mapHeight * blox)
    //Initialize transform state
    ctx.setTransform( scale,0,0,scale,0,0)
    ctxTop.setTransform(scale,0,0,scale,0,0)
    //On death, reset the scale to show full map - will apply to both contexts
    if (this.props.gameover|| this.props.levelComplete){
      let widthScale = this.props.viewWidth / (this.props.mapWidth*blox)
      let heightScale = this.props.viewHeight / (this.props.mapHeight*blox)
      scale = (widthScale > heightScale ? heightScale : widthScale)
      ctx.setTransform( scale,0,0,scale,0,0)
      ctxTop.setTransform(scale,0,0,scale,0,0)
    }

    //Set the viewport - player is centered, unless at the edge of the map
    //If
    let playerX = this.props.player.location.x * blox
    let playerY = this.props.player.location.y * blox
    if(!this.props.gameover && !this.props.levelComplete){
      let cameraX = this.clamp( playerX - this.props.viewWidth/2, 0, this.props.mapWidth*blox-this.props.viewWidth)
      let cameraY = this.clamp( playerY - this.props.viewHeight/2, 0, this.props.mapHeight*blox-this.props.viewHeight)
      ctx.translate(-cameraX, -cameraY)
      ctxTop.translate(-cameraX, -cameraY)
    }

    //draw dungeon map tiles.
    //ctx is lower layer, initially hidden
    //ctxTop is upper layer.  It is black, unless the player has visited, then it will match bottom layer
    for( let y=0; y<this.props.mapHeight; y++){
      const newRow=[];
      for( let x=0; x<this.props.mapWidth; x++){
        ctx.fillStyle = COLORS[this.props.map[x][y].type]
        ctx.strokeStyle = STROKES[this.props.map[x][y].type]
        ctx.fillRect(x*blox, y*blox, blox, blox)
        ctx.strokeRect(x*blox, y*blox, blox, blox)
        if(this.props.darkness || this.props.gameover){
          ctxTop.fillStyle = this.props.map[x][y].visited ? COLORS[this.props.map[x][y].type] : COLORS[0]
          ctxTop.strokeStyle = this.props.map[x][y].visited ? STROKES[this.props.map[x][y].type] : COLORS[0]
          ctxTop.fillRect(x*blox, y*blox, blox, blox)
          ctxTop.strokeRect(x*blox, y*blox, blox, blox)
        }
      }
    }

    /* draw player star (black if dead)*/
    ctx.fillStyle = this.props.player.alive() ? COLORS[4] : COLORS[0]
    Shapes.drawStar(ctxTop, playerX+blox/2, playerY+blox/2, blox/2+2, ctx, this.props.player.getLightLevel())
    if( this.props.darkness) Shapes.drawGlow(ctxTop, playerX+blox/2, playerY+blox/2, this.props.player.getLightLevel())
    /* draw remaining items - monsters, health, weapons, armor, lights, boss and exit */
    for( let i=0; i<this.props.occupants.length; i++){
      let x = this.props.occupants[i].location.x * blox
      let y = this.props.occupants[i].location.y * blox
      ctx.fillStyle = COLORS[this.props.occupants[i].type]
      switch(this.props.occupants[i].type){
        //add monsters (add to both layers so you can always see them)
        case 5:
          ctxTop.fillStyle = COLORS[this.props.occupants[i].type]
          Shapes.drawMonster(ctxTop, x, y, blox)
          break
        //add food(health)
        case 6:
          Shapes.drawHeart(ctx, x, y, blox)
          break
        //add weapon
        case 7:
          Shapes.drawWeapon(ctx,x,y,blox)
          break;
        //add armor
        case 8:
          Shapes.drawShield(ctx, x, y, blox)
          break
        //add light
        case 9:
          Shapes.drawLight(ctxTop, x, y, blox, this.props.player.getLightLevel())
          break
        //add boss
        case 10:
          Shapes.drawBoss(ctx, x, y, blox)
          break
        //add exit
        case 11:
          Shapes.drawExit(ctx, x, y, blox)
          break
        default:
          ctx.fillRect(x, y, blox, blox)
      }
    }
    //Call reveal function to show whole map -
    if( !this.props.player.alive() || this.props.gameover){
      Shapes.reveal(ctxTop, this.props.mapWidth*blox, this.props.mapHeight*blox)
    }
  }

  // Helper function for setting the viewport based on player's position
  clamp(value, min, max){
    if (value<min) {return min}
    else if (value>max) {return max}
    return value
  }

showTouchControls(){
    return(
      <div className='controls'>
        <div className={this.state.up + 'up'} id="up" onTouchStart={(e)=>{this.handleTouch(e)}} onTouchEnd={(e)=>{this.handleTouchEnd(e)}}>.</div>
        <div className={this.state.down + 'down'} id="down" onTouchStart={(e)=>{this.handleTouch(e)}} onTouchEnd={(e)=>{this.handleTouchEnd(e)}}>.</div>
        <div className={this.state.left + 'left'} id="left" onTouchStart={(e)=>{this.handleTouch(e)}} onTouchEnd={(e)=>{this.handleTouchEnd(e)}}>.</div>
        <div className={this.state.right + 'right'} id="right" onTouchStart={(e)=>{this.handleTouch(e)}} onTouchEnd={(e)=>{this.handleTouchEnd(e)}}>.</div>
      </div>
    )
  }
  render(){
    return(
      <div>
        {this.props.splash ? <Splash /> : ''}
        <SettingsContainer getDim={this.updateDimensions}/>
        <Scoreboard />
        <Snackbar getDim={this.updateDimensions}/>
        <canvas className="centered" id="dungeon0" width={this.props.viewWidth} height={this.props.viewHeight}>
        </canvas>
        <canvas className="centered" id="dungeon1" width={this.props.viewWidth} height={this.props.viewHeight}>
        </canvas>
        {this.props.touch ? this.showTouchControls() : ''}
      </div>
    )
  }
}

const Row = (props) => {
  return ( <div className="row">{props.children}</div>)
}
const Cell = (props) => {
  return ( <div className={props.desc}>{props.val}</div>)
}

const mapStateToProps = (state) => {
  return ({
    map: state.map.map,
    mapHeight: state.map.mapHeight,
    mapWidth: state.map.mapWidth,
    blocksize: state.map.blocksize,
    player: state.map.player,
    occupants: state.map.occupants,
    viewWidth: state.map.viewWidth,
    viewHeight: state.map.viewHeight,
    levelComplete: state.map.levelComplete,
    gameover: state.map.gameover,
    darkness: state.map.darkness,
    splash: state.ui.splash,
    touch: state.ui.touchEnabled
  })
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Map)
