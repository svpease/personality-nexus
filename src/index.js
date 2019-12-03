import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'

import thunk from 'redux-thunk';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
//import { routerMiddleware } from 'react-router-redux';

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, logger))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
