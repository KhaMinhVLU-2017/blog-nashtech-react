import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap'

class ModalComment extends React.Component {
  constructor(props) {
    super(props)
    this.state = { modal: false, comment: {} }
    this.cancelEvent = this.cancelEvent.bind(this)
    this.handlCHange = this.handlCHange.bind(this)
    //this.EventEditComment = this.EventEditComment.bind(this)
    this.keyUpEnter = this.keyUpEnter.bind(this)
  }
  keyUpEnter(e){
    if(e.keyCode ===13){
      this.EventEditComment(false) // Edit comment
    }
  }
  componentWillReceiveProps(nextProps){
    let {modal,comment} = nextProps
    this.setState({modal,comment})
  }

  handlCHange(e) {
    let { value } = e.target
    let { comment } = this.props
    comment = { ...comment, content: value }
    this.setState({ comment })
  }
  EventEditComment(status) {
    let { comment } = this.state
    this.props.childEditCM(comment,status)
  }
  cancelEvent() {
    this.props.cancelToggle(false)
  }
  render() {
    let { comment } = this.props
    return (
      <>
        <Modal isOpen={this.props.modal}>
          <ModalHeader>Edit Comment</ModalHeader>
          <ModalBody>
            <p><strong>Author:</strong> {comment.authorComment}</p>
            <p><strong>Create at:</strong> {comment.crDate}</p>
            <Input onKeyUp={this.keyUpEnter} defaultValue={comment.content} name='content' onChange={this.handlCHange} />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={() => this.EventEditComment(true)}>Delete Comment</Button>
            <Button color="info" onClick={this.cancelEvent}>Cancel</Button>{' '}
            <Button color="success" onClick={() => this.EventEditComment(false)}>Save</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default ModalComment