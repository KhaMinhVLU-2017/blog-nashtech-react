import React from 'react'
import { Redirect } from 'react-router-dom'

class Forbidden extends React.Component {
  constructor(props) {
    super(props)
    this.state = { timmer: 3, redirect: false }
    this.Timeout = this.Timeout.bind(this)
  }
  componentDidMount(){
    let self = this
    let count = this.state.timmer
    let meo = setInterval(()=>{
      count--
      if(count <=0){
        clearInterval(meo)
      }
      self.Timeout(count)
    },1000)

  }
  Timeout(count) {
    if (count > 0) {
      this.setState({ timmer: count })
    }
    if (count === 0) {
      this.setState({ redirect: true })
    }
  }
  render() {
    if(this.state.redirect) {
     return  <Redirect to='/home' />
    }
    return (
      <div className='text-center'>
        <h1 className='text-danger'>Forbidden</h1>
        <h3><em>You not role trying it...!</em></h3>
        <p>You are comback home after {this.state.timmer}s</p>
      </div>
    )

  }
}
export default Forbidden
