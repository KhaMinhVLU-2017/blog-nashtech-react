import React from 'react'
import './App.css'
import Layout from './components/layout'
import { BrowserRouter as Router, Route,Redirect } from "react-router-dom"
import Register from './components/register'
import Login from './components/login'
import Forbidden from './components/forbidden'
import 'moment-timezone'

function App() {
  return (
    <div className='container-fluid'>
      <Router>
        <Route exact path='/' render={props => props.match.path==='/' && <Redirect to='/home' />} />
        <Route path='/home' render={(props) => <Layout {...props} />} />
        <Route path='/register' component={Register}/>
        <Route path='/login' component={Login} />
        <Route path='/forbidden'  component={Forbidden}/>
      </Router>
    </div>
  )
}

export default App
