import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button,FormFeedback, Alert,Row, Col } from 'reactstrap';
import axio from 'axios'
import {setUser} from '../redux/action'
import {connect} from 'react-redux'

class Register extends Component {
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
      screenInvalid:false,
      messageInvalid:'',
      redirect:false
    }
    this.onHandlerChange = this.onHandlerChange.bind(this)
    this.submitSever= this.submitSever.bind(this)
  }
  submitSever(){
    let Username = this.state.username.value
    let Fullname = this.state.fullname.value
    let Password = this.state.passsword.value

    let  bodyFormData = new FormData();
    bodyFormData.set('Username',Username)
    bodyFormData.set('Fullname',Fullname)
    bodyFormData.set('Password',Password)

    let self = this
    axio({
      url: '/Account/register',
      baseURL: 'http://localhost:54355/api/',
      method: 'post',
      data:bodyFormData
    })
    .then(res => {
      console.log(res)
      let {status,message} = res.data
      if(status === 200) {
          //Doing redirect
          let { token, fullname } = res.data
          localStorage.setItem('_Fullname', fullname)
          localStorage.setItem('_Token', token)
          self.props.setUser(fullname,token)
          self.setState({ redirect: true })
      } else {
        self.setState({screenInvalid: true,messageInvalid:message})
      }
    })
    .catch(err => {
      console.log(err)
    })
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
  render() {
    let validUsername = this.state.username.valid
    let validFullname = this.state.fullname.valid
    let validPassword = this.state.passsword.valid
    if (this.state.redirect) {
      return (<Redirect to='/home' />)
    }
    return (
      <Row>
        <Col className='bg-register' md='6' sm='6' xs='12'></Col>
        <Col md='6' sm='6' xs='12'>
          <div className='register-form'>
            <p className='register-title'>Register</p>
            <Form>
              <FormGroup>
                <Label >Fullname</Label>
                <Input invalid={this.state.fullname.invalid} valid={this.state.fullname.valid} id='fullname' value={this.state.fullname.value} onChange={this.onHandlerChange} />
                <FormFeedback>Oh noes! that field not too 30 char</FormFeedback>
              </FormGroup>
            </Form>
            <Form>
              <FormGroup>
                <Label >Username</Label>
                <Input invalid={this.state.username.invalid} valid={this.state.username.valid} id='username' value={this.state.username.value} onChange={this.onHandlerChange} />
                <FormFeedback>Oh noes! that field not too 30 char</FormFeedback>
              </FormGroup>
            </Form>
            <Form>
              <FormGroup>
                <Label >Password</Label>
                <Input type='password' invalid={this.state.passsword.invalid} valid={this.state.passsword.valid} id='passsword' value={this.state.passsword.value} onChange={this.onHandlerChange} />
                <FormFeedback>Oh noes! that field not too 30 char</FormFeedback>
              </FormGroup>
            </Form>
            {(this.state.screenInvalid && <Alert color='danger'>{this.state.messageInvalid}</Alert>)}
            <p className='float-right'>
              <Button outline color='danger' onClick={() => this.props.history.goBack()}>Cancel</Button>
              &ensp;
              {validUsername && validPassword && validFullname ? <Button onClick={this.submitSever} outline color='success'>Create</Button>: <Button outline color='success' disabled>Create</Button>}
            </p>
          </div>
        </Col>
      </Row>
    )
  }
}

export default connect(null,{setUser})(Register)