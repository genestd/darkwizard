import React from 'react'
import * as Actions from '../actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
class Map extends React.Component{

  constructor(props){
    super(props)
    this.keypressEvent = this.keypressEvent.bind(this)
  }

  //bind eventlisteners to keys
  componentWillMount(){
    document.addEventListener('keydown', this.keypressEvent)
  }
  //remove eventListers
  componentWillUnmount(){
    document.removeEventListener('keydown', this.keypressEvent)
  }

  keypressEvent(e){
    switch(e.which){
      case 37:
        this.props.actions.movePlayer({x:-1, y:0})
        break
      case 38:
      this.props.actions.movePlayer({x:0, y:-1})
        break
      case 39:
      this.props.actions.movePlayer({x:1, y:0})
        break
      case 40:
      this.props.actions.movePlayer({x:0, y:1})
        break
    end
    }
  }

  render(){
    const materials=["floor", "corridor", "room", "wall", "player"]
    let board = [];
    let dungeon = this.props.map
    for( let y=0; y<this.props.mapHeight; y++){
      const newRow=[];
      for( let x=0; x<this.props.mapWidth; x++){
        let key = x + "x" + y + "y"
        newRow.push(
          <Cell key={key} desc={materials[dungeon[x][y].type]} val=" "/> )
      }
      board.push( <Row key={y}>{newRow}</Row> );
    }

    return(
      <div>
        <h1>Hello React!</h1>
        {board}
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
  console.log(state)
  return ({
    map: state.map.map,
    mapHeight: state.map.mapHeight,
    mapWidth: state.map.mapWidth
  })
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Map)
