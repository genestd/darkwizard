import {TOGGLE_MENU} from '../actions'

const INITIAL_STATE = {
  showMenu: false,
  menuClass: 'hideMenu'
}

function uiReducer(state=INITIAL_STATE, action){

  switch(action.type){

    case TOGGLE_MENU:
      let newClass = (state.menuClass === 'hideMenu' ? 'showMenu' : 'hideMenu')
      return Object.assign({}, state, {showMenu: !state.showMenu, menuClass: newClass})
      break

    default:
      return Object.assign({}, state)
  }
}
export default uiReducer
