import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '../actions'

class Splash extends React.Component{
  constructor(props){
    super(props)
  }

  handleClick(e){
    this.props.actions.setTouch(false)
    this.props.actions.hideSplash()
  }
  handleTouch(e){
    e.preventDefault()
    this.props.actions.setTouch(true)
    this.props.actions.hideSplash()
  }
  render(){
    return( <div id='splash' className='splash' onClick={(e)=>{this.handleClick(e)}} onTouchEnd={(e)=>{this.handleTouch(e)}}>
              Path To Enlightenment <br/><br/>
              <button id='play'>Play!</button>
            </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    touch: state.ui.touchEnabled
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    actions: bindActionCreators(Actions, dispatch)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)
