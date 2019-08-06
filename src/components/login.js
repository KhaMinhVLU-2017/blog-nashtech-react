import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { FormGroup, Label, Input, Button, FormFeedback, Alert, Row, Col } from 'reactstrap'
import axios from 'axios'
import { setUser } from '../redux/action'
import { connect } from 'react-redux'
import { urlServer } from '../helper/config'
import LoadIMG from '../images/loading.gif'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: {
        value: ''
        , valid: false
        , invalid: false
      }, passsword: {
        value: ''
        , valid: false
        , invalid: false
      }, fullname: {
        value: ''
        , valid: false
        , invalid: false
      },
      screenInvalid: false,
      messageInvalid: '',
      redirect: false,
      loading: false
    }
    this.onHandlerChange = this.onHandlerChange.bind(this)
    this.submitServer = this.submitServer.bind(this)
    this.eventEnter = this.eventEnter.bind(this)
  }
  onHandlerChange(e) {
    let { id, value } = e.target
    let cLength = value.length
    //Modified
    let meoObj = this.state[id]

    if (cLength < 5) {
      meoObj.valid = false
      meoObj.invalid = false
      this.setState({ [id]: meoObj })
    }
    if (cLength > 5) {
      meoObj.valid = true
      meoObj.invalid = false
      this.setState({ [id]: meoObj })
    }
    if (cLength > 30) {
      meoObj.valid = false
      meoObj.invalid = true
      this.setState({ [id]: meoObj })
    }
    meoObj.value = value
    this.setState({ [id]: meoObj })
  }
  eventEnter(e) {
    if (e.keyCode === 13) {
      this.submitServer()
    }
  }
  submitServer() {
    let self = this
    this.setState({ loading: true })
    let formdata = new FormData()
    formdata.set('Password', this.state.passsword.value)
    formdata.set('Username', this.state.username.value)
    axios.defaults.headers.common['Authorization'] = '';
    axios({
      url: '/Account/login',
      baseURL: urlServer,
      method: 'post',
      data: formdata,
      timeout: 3000,
    })
      .then(res => {
        let { status, message } = res.data
        setTimeout(() => {
          if (status === 200) {
            let { token, fullname } = res.data
            localStorage.setItem('_Fullname', fullname)
            localStorage.setItem('_Token', token)
            self.props.setUser(fullname, token)
            self.setState({ redirect: true, loading: false })
          } else {
            self.setState({ screenInvalid: true, messageInvalid: message, loading: false })
          }
        }, 1000)
      })
      .catch(err => {
        self.setState({ screenInvalid: true, messageInvalid: 'Server Interval', loading: false })
      })
  }
  render() {
    let validUsername = this.state.username.valid
    let validPassword = this.state.passsword.valid
    let { loading } = this.state
    if (this.state.redirect) {
      return (<Redirect to='/home' />)
    }
    return (
      <Row>
        <Col className='bg-register' md='6' sm='6' xs='12'></Col>
        {loading ? <img className='col-md-6 col-sm-6 col-xs-12 col-lg-6' src={LoadIMG} alt='Loading Spendtime' /> :
          <Col md='6' sm='6' xs='12'>
            <div className='register-form'>
              <p className='register-title'>Login</p>
              <FormGroup>
                <Label >Username</Label>
                <Input invalid={this.state.username.invalid} valid={this.state.username.valid} id='username' value={this.state.username.value} onChange={this.onHandlerChange} />
                <FormFeedback>Oh noes! that field not too 30 char</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label >Password</Label>
                <Input onKeyUp={this.eventEnter} type='password' invalid={this.state.passsword.invalid} valid={this.state.passsword.valid} id='passsword' value={this.state.passsword.value} onChange={this.onHandlerChange} />
                <FormFeedback>Oh noes! that field not too 30 char</FormFeedback>
              </FormGroup>
              {this.state.screenInvalid && <Alert color='danger'>{this.state.messageInvalid}</Alert>}
              <p className='float-right'>
                <Button outline color='danger' onClick={() => this.props.history.goBack()}>Cancel</Button>
                &ensp;
              {validUsername && validPassword ? <Button outline onClick={this.submitServer} color='success'>Login</Button>
                  : <Button outline color='success' disabled>Login</Button>}
              </p>
            </div>
          </Col>
        }
      </Row>
    )
  }
}

export default connect(null, { setUser })(Login)