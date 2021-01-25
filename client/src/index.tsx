import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import Index from './components/Index/Index'
import SignUp from './components/SignUp/SignUp'

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <Route path="/" exact component={Index} />
    <Route path="/sign-up" exact component={SignUp} />
  </Router>,
  document.getElementById('root')
)
