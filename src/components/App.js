import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import './bootstrap.css'
import Registration from './Registration';
import Login from './Login'
import {
  Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { createBrowserHistory } from 'history';
import Homepage from './Homepage';
import {PrivateRoute} from '../PrivateRoute'

const hist = createBrowserHistory();
class  App extends Component {
  render(){
  return (
    <div className="App">
    <Router history={hist}>
          <div>
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Route exact path="/home" component={Registration} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/homepage" component={Homepage} />
              <Redirect from="*" to="/home" />
            </Switch>
          </div>
        </Router>
    </div>
  );
  }
}

export default App;
