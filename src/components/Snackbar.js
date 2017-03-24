import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '../actions'

class Snackbar extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      timer: 0
    }
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.gameover || nextProps.levelComplete){
      window.clearTimeout(this.state.timer)
    } else {
      window.clearInterval(this.state.timer)
      let t = window.setTimeout( ()=>{this.props.actions.resetMessage()}, 3000)
      this.setState({ timer: t})
    }
  }

  nextLevel(){
    if (this.props.levelComplete  && !this.props.gameover){
      return(<img src="utils/exit.svg" className="levelUp"
              onClick={()=>{this.props.actions.generateLevel();this.props.getDim();this.props.actions.resetMessage()}}/>)
    }
  }

  render(){
    let display = 'hide '
    if (this.props.message != ''){
      display = 'show '
    }
    return (<div className={display + 'snackbar'}>{this.props.message}{this.nextLevel()}</div>)
  }
}

const mapStateToProps = (state) => {
  return({
    message: state.map.message,
    gameover: state.map.gameover,
    levelComplete: state.map.levelComplete
  })
}
const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(Actions, dispatch)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar)
