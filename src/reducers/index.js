import {combineReducers} from 'redux'
import mapReducer from '../reducers/mapReducer'
import uiReducer from '../reducers/uiReducer'

const rootReducer = combineReducers({
  map: mapReducer,
  ui: uiReducer
})

export default rootReducer
