import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Actions from '../actions'
import Settings from '../components/Settings'

class SettingsContainer extends React.Component{
  constructor(props){
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(target){

    switch( target.name){
      case "td":
        this.props.actions.toggleDarkness(target.value)
        this.props.actions.toggleMenu()
        break;
      case "md":
        this.props.actions.setMonsterDensity(target.value)
        break;
      case "rd":
        this.props.actions.setRoomDensity(target.value)
        break;
      case "ts":
        this.props.actions.setTileSize(parseInt(target.value))
        this.props.getDim()
        break;
    end
    }
  }

  render(){
    return (
        <Settings handleChange={this.handleChange}
                  td={this.props.darkness}
                  md={this.props.monsterDensity}
                  rd={this.props.roomDensity}
                  ts={this.props.blocksize}
                  toggleMenu={this.props.actions.toggleMenu}
                  menuClass={this.props.menuClass} />
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    showMenu: state.ui.showMenu,
    menuClass: state.ui.menuClass,
    darkness: state.map.darkness,
    monsterDensity: state.map.monsterDensity,
    roomDensity: state.map.roomDensity,
    blocksize: state.map.blocksize
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    actions: bindActionCreators(Actions, dispatch)
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
