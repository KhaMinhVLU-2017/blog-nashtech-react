import React from 'react'
import Header from './header'
import { Row } from 'reactstrap'
import Footer from './footer'
import Homepage from './homepage'
import CreatePost from './createpost'
import { Route, Redirect } from 'react-router-dom'
import Detail from './detail'
import Update from './update'
import { connect } from 'react-redux'

function Layout(props) {
  return (
    <>
      <Row>
        <Header />
      </Row>
      <Row>
        <div className='body-bg'>
          <div className='bg-center'>
            <h1 className='bg-title'>Programing Life </h1>
          </div>
        </div>
        <Route exact path={`${props.match.path}`} component={Homepage} />
        <PrivateRoute path={`${props.match.path}/create`} component={CreatePost} {...props} />
        <Route path={`${props.match.path}/detail/:id`} component={Detail} {...props} />
        <PrivateRoute path={`${props.match.path}/edit/:id`} component={Update} {...props} />
      </Row>
      <Row className='footer'>
        <Footer />
      </Row>
    </>
  )
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => {
      if (rest.fullname) {
        return <Component {...props} />
      }else{
        return <Redirect to={{
        pathname: "/login",
        state: { from: props.location }     }}/>
      }
    }}/>
  )
}

const mapStatetoprops = state => ({
  fullname: state.user.fullname
})

export default connect(mapStatetoprops)(Layout)