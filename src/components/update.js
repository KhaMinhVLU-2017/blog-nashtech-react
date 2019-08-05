import React, { Component } from 'react'
import Titlesector from './titlesector'
import {
  Row, Form, FormGroup, Label, Input, Col, Button,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import SimpleMDE from "react-simplemde-editor"
import { Redirect} from 'react-router-dom'
import axios from 'axios'
import { urlServer, urlImgServer } from '../helper/config'
import { connect } from 'react-redux'
import { deleteUser } from '../redux/action'

class Update extends Component {
  constructor(props) {
    super(props)
    this.state = { content: '', imagePreviewUrl: '', file: '', modal: false, redirect: false, blog: {}, redirectFor: false,redirectSucc : false }
    this.handleChange = this.handleChange.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.toggle = this.toggle.bind(this)
    this.handleChangeINPUT = this.handleChangeINPUT.bind(this)
    this.submitServer = this.submitServer.bind(this)
    this.submitDelete = this.submitDelete.bind(this)
  }
  componentWillMount() {
    this.checkAuthorPath()
  }
  checkAuthorPath() {
    let { pathname } = this.props.history.location
    let urlPath = pathname.split('/')
    pathname = `/${urlPath[1]}/${urlPath[2]}`
    let { token } = this.props
    let formdata = new FormData()
    formdata.set('Path', pathname)
    axios.defaults.headers.common['Authorization'] = token;
    axios({
      url: '/AuthorPath/Check',
      baseURL: urlServer,
      method: 'post',
      data: formdata
    })
      .then(res => {
        let { status } = res.data
        if (status === 200) {
          this.setState({ redirectSucc: false })
        } else
          if (status === 403) {
            this.props.deleteUser()
            this.setState({ redirect: true })
          } else {
            this.props.deleteUser()
            this.setState({ redirect: true })
          }

      })
      .catch(err => {
        console.log(err)
      })
  }
  toggle() {
    this.setState({ modal: !this.state.modal })
  }
  handleChange(value) {
    this.setState({blog: {...this.state.blog,content: value} })
    //console.log(this.state.blog)
  }
  handleChangeINPUT(e){
    let {id,value} = e.target
    this.setState({blog:{...this.state.blog, [id]:value}})
  }
  handleImage(e) {
    let file = e.target.files[0]
    if (file) {
      let reader = new FileReader()
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }
      reader.readAsDataURL(file)
    }
    this.setState({imagePreviewUrl: ''})
  }
  componentDidMount() {
    let { id } = this.props.match.params//get ID params
    let { token } = this.props
    let self = this
    axios.defaults.headers.common['Authorization'] = token;
    axios({
      url: '/blog/get',
      method: 'get',
      baseURL: urlServer,
      params: {
        id
      }
    })
      .then(res => {
        let { blog, status } = res.data
        if (blog === {} || blog === undefined) {
          self.setState({ redirectFor: true })
        } else {
          if (status === 200) {
            self.setState({ blog })
          } else if (status === 403) {
            this.props.deleteUser()
            self.setState({ redirect: true })
          } else {
            this.props.deleteUser()
            self.setState({ redirect: true })
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  submitServer(){
    let self = this
    let {blog,imagePreviewUrl} = this.state
    let formdata = new FormData()
    formdata.set('BlogID', blog.blogID)
    formdata.set('Title', blog.title)
    formdata.set('Sapo', blog.sapo)
    formdata.set('Content', blog.content)
    formdata.set('file', this.state.file)
    if(imagePreviewUrl){
      formdata.set('Picture', 'KeepNew')
    } else {
      formdata.set('Picture', 'KeepOld')
    }
    let { token } = this.props
    if (token !== null) {
      axios.defaults.headers.common['Authorization'] = token;
      axios({
        url: '/Blog/Edit',
        baseURL: urlServer,
        method: 'post',
        data: formdata
      })
        .then(res => {
          let { status } = res.data
          if (status === 200) {
            self.setState({ redirectSucc: true })
          } if (status === 403) {
            self.setState({ redirectFor: true })
          } else {
            self.setState({ redirect: true })
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    } 
  }
  submitDelete(){
    let self = this
    let {blog} = this.state
    let {token} = this.props
    let formdata = new FormData()
    formdata.set('id',blog.blogID)
    axios.defaults.headers.common['Authorization'] = token;
      axios({
        url: '/Blog/Remove',
        baseURL: urlServer,
        method: 'post',
        data: formdata
      })
        .then(res => {
          let { status } = res.data
          console.log(res)
          if (status === 200) {
            //self.setState({ redirect: true })
          } if (status === 403) {
            self.setState({ redirectFor: true })
          } else {
            self.setState({ redirect: true })
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
  }
  render() {
    // eslint-disable-next-line
    let { redirect, redirectFor, imagePreviewUrl, blog,redirectSucc } = this.state
    let { pathname } = this.props.history.location
    pathname =pathname.replace('edit','detail')

    if(redirectSucc){
      return <Redirect to={pathname} />
    }
    if (redirect) {
      return <Redirect to='/home' />
    }
    if (redirectFor) {
      return <Redirect to='/forbidden' />
    }
    return (
      <>
        <Titlesector title='Update' />
        <Col className='article' xs='12' md='12' sm='12'>
          <Row>
            <Col xs='12' sm='6' md='6'>
              <Form>
                <FormGroup>
                  <Label for="title"><strong>Title</strong></Label>
                  <Input type="text" defaultValue={blog.title} name="title" onChange={this.handleChangeINPUT  } id="title" placeholder="Title" />
                </FormGroup>
                <FormGroup>
                  <Label for="sapo"><strong>Sapo</strong></Label>
                  <Input type="textarea" value={blog.sapo} name="sapo" onChange={this.handleChangeINPUT} id="sapo" placeholder="Sapo" />
                </FormGroup>
                <FormGroup>
                  <Label for="file"><strong>Image</strong></Label>
                  <Input onChange={this.handleImage} type="file" name="file" id="file" />
                </FormGroup>
                <FormGroup>
                  {imagePreviewUrl === '' ? blog.picture ? <img className='imgThumnail' src={`${urlImgServer}/${blog.picture}`} alt='Blog' />
                    :
                    <img className='imgThumnail' src={imagePreviewUrl} alt='Blog' /> : <img className='imgThumnail' src={imagePreviewUrl} alt='Blog' />}
                </FormGroup>
              </Form>
            </Col>
            <Col xs='12' sm='6' md='6'>
              <Form>
                <FormGroup>
                  <Label for="content"><strong>Content</strong></Label>
                  <SimpleMDE
                    id='content'
                    onChange={this.handleChange}
                    value={blog.content}
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
            <Col xs='6' md='6' sm='6'>
              <p className='float-left'>
                <Button color='danger' onClick={this.toggle}>Delete Blog</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} >
                  <ModalHeader toggle={this.toggle}>Are you remove it ?</ModalHeader>
                  <ModalBody>
                    {blog.title}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.toggle}>Cancel</Button>{' '}
                    <Button color="success" onClick={this.submitDelete}>Ok</Button>
                  </ModalFooter>
                </Modal>
              </p>
            </Col>
            <Col xs='6' sm='6' md='6'>
              <p className='float-right'>
                <Button color='danger'onClick={() => {this.props.history.goBack()}}>Cancel</Button>
                &ensp;
              <Button onClick={this.submitServer} color='success'>Create</Button>
              </p>
            </Col>
          </Row>
        </Col>
      </>
    )
  }
}

const mapStatetoprops = state => ({
  token: state.user.token
})

export default connect(mapStatetoprops, { deleteUser })(Update)
