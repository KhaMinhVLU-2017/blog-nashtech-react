import React, { Component } from 'react'
import Titlesector from './titlesector'
import { Row, Form, FormGroup, Label, Input, Col, Button, Alert } from 'reactstrap'
import SimpleMDE from "react-simplemde-editor"
import axios from 'axios'
import { urlServer } from '../helper/config'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {deleteUser} from '../redux/action'

class CreatePost extends Component {
  constructor(props) {
    super(props)
    this.state = { content: '', imagePreviewUrl: '', file: '', title: '', 
    sapo: '', redirect: false, errorMess: '', errorStatus: false,visible:false,redirectErro:false }
    this.handleChange = this.handleChange.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.submitCreate = this.submitCreate.bind(this)
    this.handlefield = this.handlefield.bind(this)
  }
  handleChange(value) {
    this.setState({ content: value })
  }
  componentWillMount(){
    this.checkAuthorPath()
  }
  componentDidMount(){
    let {token} = this.props
    if(token===''){
    this.setState({ errorStatus: true, errorMess: 'Please Login' })
    }
  }
  handlefield(e) {
    let { value, id } = e.target
    this.setState({ [id]: value })
  }
  handleImage(e) {
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
    this.setState({ file })
  }
  submitCreate() {
    let self = this
    let formdata = new FormData()
    formdata.set('Title', this.state.title)
    formdata.set('Sapo', this.state.sapo)
    formdata.set('Content', this.state.content)
    formdata.set('Content', this.state.content)
    formdata.set('file', this.state.file)
    let { token } = this.props
    if (token !== null) {
      axios.defaults.headers.common['Authorization'] = token;
      axios({
        url: '/Blog/Create',
        baseURL: urlServer,
        method: 'post',
        data: formdata
      })
        .then(res => {
          let { message, status } = res.data
          if (status === 200) {
            self.setState({ redirect: true })
          } if (status === 403) {
            self.setState({ errorStatus: true, errorMess: message,redirectErro: true })
          } else {
            self.setState({ errorStatus: true, errorMess: message,redirectErro: true })
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    } 
  }
  checkAuthorPath(){
    let {pathname} = this.props.history.location
    let {token} = this.props
    let formdata = new FormData()
    formdata.set('Path',pathname)
    axios.defaults.headers.common['Authorization'] = token;
    axios({
      url: '/AuthorPath/Check',
      baseURL: urlServer,
      method: 'post',
      data: formdata
    })
    .then(res => {
      let {status} = res.data
      if(status===200) {
        this.setState({redirect:false,visible:true})
      }else
      if(status===403) {
        this.props.deleteUser()
        this.setState({redirect:true})
      }else{
        this.props.deleteUser()
        this.setState({redirect:true})
      }

    })
    .catch(err => {
      console.log(err)
    })
  }
  render() {
    if(this.state.redirectErro){
      return <Redirect to='/forbidden' />
    }
    if (this.state.redirect) {
      return <Redirect to='/home' />
    } 
    if(this.state.visible) {
    return (
      <>
        <Titlesector title='Create Blog' />
        <Col className='article' xs='12' md='12' sm='12'>
          <Row>
            <Col xs='12' sm='6' md='6'>
              <Form>
                <FormGroup>
                  <Label for="title"><strong>Title</strong></Label>
                  <Input type="text" name="title" onChange={this.handlefield} id="title" placeholder="Title" />
                </FormGroup>
                <FormGroup>
                  <Label for="sapo"><strong>Sapo</strong></Label>
                  <Input type="textarea" name="sapo" onChange={this.handlefield} id="sapo" placeholder="Sapo" />
                </FormGroup>
                <FormGroup>
                  <Label for="file"><strong>Image</strong></Label>
                  <Input onChange={this.handleImage} type="file" name="file" id="file" />
                </FormGroup>
                <FormGroup>
                  <img className='imgThumnail' src={this.state.imagePreviewUrl} alt='Blog' />
                </FormGroup>
                <FormGroup>
                  {this.state.errorStatus && <Alert color='danger'>{this.state.errorMess}</Alert>}
                </FormGroup>
              </Form>
            </Col>
            <Col xs='12' sm='6' md='6'>
              <Form>
                <FormGroup>
                  <Label for="content"><strong>Content</strong></Label>
                  <SimpleMDE
                    id='simple-MDE'
                    onChange={this.handleChange}
                    value={this.state.content}
                    options={{
                      autofocus: true,
                      spellChecker: false,
                      insertTexts: {
                        image: ["![pessi](http://", ")"]
                      }
                    }}
                  />
                </FormGroup>
              </Form>
            </Col>
            <Col xs='12' sm='12' md='12'>
              <p className='float-right'>
                <Button color='danger'>Cancel</Button>
                &ensp;
              <Button onClick={this.submitCreate} color='success'>Create</Button>
              </p>
            </Col>
          </Row>
        </Col>
      </>
    )
    }
      return <h1>Hello World</h1>
  }
}

const mapStatetoprops = state => ({
  token: state.user.token
})

export default connect(mapStatetoprops,{deleteUser})(CreatePost)

