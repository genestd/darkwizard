import {TOGGLE_MENU, SET_TOUCH, HIDE_SPLASH} from '../actions'


const INITIAL_STATE = {
  showMenu: false,
  menuClass: 'hideMenu',
  touchEnabled: false,
  splash: true
}

function uiReducer(state=INITIAL_STATE, action){

  switch(action.type){

    case TOGGLE_MENU:
      let newClass = (state.menuClass === 'hideMenu' ? 'showMenu' : 'hideMenu')
      return Object.assign({}, state, {showMenu: !state.showMenu, menuClass: newClass})
      break

    case SET_TOUCH:
    console.log(action)
      return Object.assign({}, state, {touchEnabled: action.payload})

    case HIDE_SPLASH:
      return Object.assign({}, state, {splash: false})

    default:
      return Object.assign({}, state)
  }
}
export default uiReducer
