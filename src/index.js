import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import store from './utils/store'
import Map from './components/Map'
import './styles/main.scss';

ReactDOM.render( (<Provider store={store}>
                    <Map />
                  </Provider>), document.getElementById('app') );
