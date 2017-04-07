export const GENERATE_LEVEL = 'GENERATE_LEVEL'
export const MOVE_PLAYER = 'MOVE_PLAYER'
export const UPDATE_DIMENSIONS = 'UPDATE_DIMENSIONS'
export const RESET_MESSAGE = 'RESET_MESSAGE'
export const TOGGLE_MENU = 'TOGGLE_MENU'
export const TOGGLE_DARKNESS = 'TOGGLE_DARKNESS'
export const SET_MONSTER_DENSITY = 'SET_MONSTER_DENSITY'
export const SET_ROOM_DENSITY = 'SET_ROOM_DENSITY'
export const SET_TILE_SIZE = 'SET_TILE_SIZE'
export const SET_TOUCH = 'SET_TOUCH'
export const HIDE_SPLASH = 'HIDE_SPLASH'

export const generateLevel = () => ({
  type: GENERATE_LEVEL
})
export const movePlayer = (dir) => {
  return ({
    type: MOVE_PLAYER,
    payload: dir
  })
}
export const updateDimensions = (size) => ({
  type: UPDATE_DIMENSIONS,
  payload: size
})
export const resetMessage = () => ({
  type: RESET_MESSAGE
})
export const toggleMenu = () => ({
  type: TOGGLE_MENU
})
export const toggleDarkness = (d) => ({
  type: TOGGLE_DARKNESS,
  payload: d
})
export const setMonsterDensity = (m) => ({
  type: SET_MONSTER_DENSITY,
  payload: m
})
export const setRoomDensity = (r) => ({
  type: SET_ROOM_DENSITY,
  payload: r
})
export const setTileSize = (t) => ({
  type: SET_TILE_SIZE,
  payload: t
})
export const setTouch = (touch) => ({
  type: SET_TOUCH,
  payload: touch
})
export const hideSplash = () => ({
  type: HIDE_SPLASH
})
