import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import Index from './components/Index/Index'

import './index.scss'

export const history = createBrowserHistory()

ReactDOM.render(
  <Router history={history}>
    <Route path="/" exact component={Index} />
  </Router>,
  document.getElementById('root')
)
