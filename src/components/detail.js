import React, { Component } from 'react'
import Titlesector from './titlesector'
import { Col, FormGroup, Label, Input, Button, Alert } from 'reactstrap'
import { urlServer, urlImgServer, hostServer } from '../helper/config'
import axios from 'axios'
import ReactMarkdown from 'react-markdown/with-html'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteUser } from '../redux/action'
import Moment from 'react-moment'
import ModalComment from './modalComment'
import * as signalR from '@aspnet/signalr'
import logger from 'logger'

class Detail extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props)
    this.connection = null
    this.state = {
      blog: { Comment: '' }, redirect: false, redirectFor: false, modalCM: false, commentObj: {}, hubConnection: null,
      isLoadLis: true,
      isRTDelete:true, //status realtime delete
      isRTEdit:true //status realtime Edit
    }
    this.onHandlChange = this.onHandlChange.bind(this)
    this.submitComment = this.submitComment.bind(this)
    this.EventKeyUp = this.EventKeyUp.bind(this)
    this.eventEditComment = this.eventEditComment.bind(this)
    this.editComment = this.editComment.bind(this) // Edit Comment from childrent return Parent

    this.handleEditCommentClient = this.handleEditCommentClient.bind(this) //Handle Comment From Client
    this.cancelModal = this.cancelModal.bind(this) // Hidden Modal
    this.deleteComment = this.deleteComment.bind(this) // Delete comment from server
    this.connectSignalR = this.connectSignalR.bind(this) // Connect signalR
    this.sendCommentAll = this.sendCommentAll.bind(this)
    this.sendDeleteComment = this.sendDeleteComment.bind(this)// Realtime delete
    this.sendEditComment = this.sendEditComment.bind(this) // Realtime Edit
  }
  // Event Comment FIlter and Pass to Modal
  eventEditComment(e) {
    let { id } = e.target
    if (id !== '' || id !== null) {
      let { listComment } = this.state.blog
      let objComment = listComment.filter(item => item.commentID === parseInt(id))[0]
      this.setState({ modalCM: true, commentObj: { ...objComment } })
    }
  }
  onHandlChange(e) {
    let { id, value } = e.target
    this.setState({ blog: { ...this.state.blog, [id]: value }, modalCM: false })
  }
  EventKeyUp(e) {
    if (e.keyCode === 13) {
      this.submitComment(true)
    }
  }
  // False not clear
  // True clear
  submitComment(check = false) {
    let self = this
    let BlogID = this.props.match.params.id//get ID params
    let { token } = this.props
    let { Comment } = this.state.blog
    let formdata = new FormData()
    formdata.set('Content', Comment)
    formdata.set('BlogID', BlogID)
    axios.defaults.headers.common['Authorization'] = token
    axios({
      url: '/Comment/Create',
      method: 'post',
      baseURL: urlServer,
      data: formdata
    })
      .then(res => {
        let { status, comment } = res.data
        if (status === 200) {
          let LCom = this.state.blog.listComment // List Comment Get Server
          LCom.unshift(comment)
          if (check) {
            self.setState({ blog: { ...this.state.blog, listComment: LCom, Comment: '' }, isLoadLis: false })
          } else {
            self.setState({ blog: { ...this.state.blog, listComment: LCom }, isLoadLis: false })
          }
          self.sendCommentAll(comment)
        } else if (status === 403) {
          self.setState({ redirectFor: true })
        } else {
          self.setState({ redirect: true })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  componentWillMount() {
    this.connectSignalR()
  }

  componentDidMount() {
    // eslint-disable-next-line
    let { id } = this.props.match.params//get ID params
    let { token } = this.props
    let self = this
    //
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
        if (status === 200) {
          self.setState({ blog })
        } else if (status === 403) {
          this.props.deleteUser()
          self.setState({ redirect: true })
        } else {
          console.log(res)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  // Connect SignalR
  connectSignalR() {
    let self = this
    const url = `${hostServer}/hubCentral`
    const protocol = new signalR.JsonHubProtocol()

    const transport = signalR.HttpTransportType.WebSockets;

    const options = {
      transport,
      logMessageContent: true,
      logger: logger,
      accessTokenFactory: () => this.props.accessToken,
    }

    // create the connection instance
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(url, options)
      .withHubProtocol(protocol)
      .build()
    this.connection.start()
      .then(() => console.info('Server Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err))
    // Listen Create Comment
    this.connection.on("ReceiveComment", (comment) => {
      if (this.state.isLoadLis) {
        let { blog } = self.state
        let { listComment } = blog // List Comment Get Server
        listComment.unshift(JSON.parse(comment))
        //console.log('stateLoad', this.state.isLoadLis)
        self.setState({ blog: { ...blog, listComment } })
      }
    })
    // Listen Remove Comment
    this.connection.on("ReceiveDelete", (commentID) => {
      if (this.state.isRTDelete) {
        let { blog } = self.state
        let { listComment } = blog // List Comment Get Server
        listComment = listComment.filter(s=>s.commentID !== commentID)
        //console.log('stateLoad', this.state.isLoadLis)
        self.setState({ blog: { ...blog, listComment } })
      }
    })
    // Listen Edit Comment
    this.connection.on("ReceiveEdit", (comment) => {
      if (this.state.isRTEdit) {
        let { blog } = self.state
        let { listComment } = blog // List Comment Get Server

        let commentJSON = JSON.parse(comment)

        listComment = listComment.map(s=>{
          if(s.commentID === commentJSON.commentID) {
            s.content = commentJSON.content
          }
          return s
        })
        //console.log('stateLoad', this.state.isLoadLis)
        self.setState({ blog: { ...blog, listComment } })
      }
    })
  }
  sendCommentAll(comment) {
    let self = this
    this.connection
      .invoke('SendComment', comment)
      .then(() => {
        self.setState({ isLoadLis: true })
      })
      .catch(err => console.error(err));
  };
  sendDeleteComment(commentID){
    let self = this
    this.connection
    .invoke('DeleteComment', commentID)
    .then(() => {
      self.setState({ isRTDelete: true })
    })
    .catch(err => console.error(err));
  }
  sendEditComment(comment){
    let self = this
    this.connection
      .invoke('EditComment', comment)
      .then(() => {
        self.setState({ isRTEdit: true })
      })
      .catch(err => console.error(err));
  }
  // Edit comment to Server
  // True: Delete
  // False Edit
  editComment(comment, status) {
    if (status) {
      this.deleteComment(comment)//Deeltet
    } else {
      this.handleEditCommentClient(comment)//Edit
    }
  }
  // Delele comment
  deleteComment(comment) {
    let self = this
    let { token } = this.props
    let formdata = new FormData()
    formdata.set('commentID', comment.commentID)
    axios.defaults.headers.common['Authorization'] = token
    axios({
      url: '/Comment/Remove',
      method: 'post',
      baseURL: urlServer,
      data: formdata
    })
      .then(res => {
        let { status } = res.data
        let { commentID } = comment
        let { listComment } = self.state.blog
        if (status === 200) {
          listComment = listComment.filter(s => s.commentID !== commentID)
          self.setState({ blog: { ...this.state.blog, listComment }, modalCM: false })
          self.sendDeleteComment(commentID)
        } else if (status === 403) {

        } else if (status === 404) {

        } else {

        }
      })
      .catch(err => {

      })
  }
  handleEditCommentClient(comment) {
    if (Object.entries(comment).length !== 0 && comment.constructor === Object) {
      let self = this
      let { token } = this.props
      let form = new FormData()
      form.set('CommentID', comment.commentID)
      form.set('Content', comment.content)
      axios.defaults.headers.common['Authorization'] = token;
      axios({
        url: '/Comment/edit',
        method: 'post',
        baseURL: urlServer,
        data: form
      })
        .then(res => {
          // logic
          let { status } = res.data
          if (status === 200) {
            let { blog } = self.state
            let { listComment } = blog
            listComment = listComment.map(item => {
              if (item.commentID === comment.commentID) {
                item = comment
                return item
              }
              return item
            })
            self.setState({ blog: { ...blog, listComment }, modalCM: false })
            self.sendEditComment(comment)
          } else if (status === 404) {

          } else if (status === 403) {

          } else if (status === 500) {

          } else {

          }
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      this.setState({ modalCM: false })
    }
  }

  cancelModal(status) {
    this.setState({ modalCM: status })
  }
  render() {
    let { blog, redirect, redirectFor } = this.state
    if (blog === null) {
      return <Titlesector title='Blog Empty' />
    }
    let { listComment } = blog
    let { fullname } = this.props
    if (redirect) return <Redirect to='/home' />
    if (redirectFor) return <Redirect to='/forbidden' />
    let { id } = this.props.match.params//get ID params
    let urlEdit = `/home/edit/${id}`
    let urlPicture = blog.picture !== null && `${urlImgServer}/${blog.picture}`
    return (
      <>
        <Titlesector title='Blog' />
        {blog.picture !== undefined && <Col className='article' xs='12' md='12' sm='12'>
          <div className='blog-detail'>
            {blog.edit && <p className='text-right'><Link className='btn btn-warning' to={urlEdit}>Edit</Link></p>}
            <h2>{blog.title}</h2>
            <p><em>&ensp;{blog.authorName}</em>&ensp;-&ensp;<Moment>{blog.crDate}</Moment></p>
            <p className='blog-sapo'>{blog.sapo}</p>
            <img src={urlPicture} width="600px;" alt='Place' />
            <div className='blog-content'>
              <ReactMarkdown
                source={blog.content}
                escapeHtml={true}
              />
            </div>
            <Col xs='12' sm='12' md='12' className='main-comment'>
              {fullname ? <FormGroup className='blog-comment'>
                <Label for="Comment">Comment</Label>
                <Input type="textarea" onChange={this.onHandlChange} onKeyUp={this.EventKeyUp} value={this.state.blog.Comment} name="Comment" id="Comment" />
                <p className='float-right'>
                  <Button color='success' onClick={this.submitComment}>Send</Button>
                </p>
              </FormGroup> : <Alert color='warning'>Please login for comment this blog</Alert>}
              <FormGroup className='blog-commented'>
                {listComment !== undefined && listComment.map(item =>
                  fullname === item.authorComment ? <p style={{ cursor: 'pointer' }} key={item.commentID + 'meoN'} id={item.commentID} onClick={this.eventEditComment}><strong>{item.authorComment}:&ensp;</strong>{item.content}</p>
                    :
                    <p key={item.commentID + 'meoN'} id={item.commentID} ><strong>{item.authorComment}:&ensp;</strong>{item.content}</p>
                )}
              </FormGroup>
              <ModalComment cancelToggle={this.cancelModal} childEditCM={this.editComment} modal={this.state.modalCM} comment={this.state.commentObj} />
            </Col>
          </div>
        </Col>
        }
      </>
    )
  }
}

const mapStatetoprops = state => ({
  token: state.user.token,
  fullname: state.user.fullname
})

export default connect(mapStatetoprops, { deleteUser })(Detail)
