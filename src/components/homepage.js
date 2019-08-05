import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import Titlesector from './titlesector'
import ImgContent from '../images/content.jpg'
import axios from 'axios'
import { urlServer, urlImgServer } from '../helper/config'
import { Link, Redirect } from 'react-router-dom'

class Homepage extends Component {
  constructor(props) {
    super(props)
    this.state = { listBlog: [], redirect: false }
  }
  componentDidMount() {
    let self = this
    axios({
      method: 'get',
      url: '/blog/list',
      baseURL: urlServer
    })
      .then(res => {
        let { listBlog, status } = res.data
        if(status===200){
          self.setState({ listBlog })
        }
        else if(status ===403) {
          self.props.deleteUser()
          self.setState({redirect:true})
        } else {
          self.props.deleteUser()
          self.setState({redirect:true})
        }     
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    if(this.state.redirect) {
      return <Redirect to='/Login' />
    }
    return (
      <>
        <Titlesector title='Computer & Life' />
        <Col className='article' xs='12' md='12' sm='12'>
          {this.state.listBlog !== [] && this.state.listBlog.map(item =>
            <Link className='content-a' to={`/home/detail/${item.blogID}`} key={item.blogID}>
              <Row className='content-row'>
                <Col className='content' xs='12' sm='6' md='6'>
                  <p className='content-title'>{item.title}</p>
                  <p className='content-sapo'><em>{item.authorName}</em>&ensp;{item.crDate}</p>
                  <p className='content-body'>{item.sapo}
                  </p>
                  <p className='content-footer'>&reg; Social Blog</p>
                </Col>
                <Col className='pad-0' xs='12' sm='6' md='6'>
                  <img className='img-resize' src={`${urlImgServer}/${item.picture}`} alt='Images' />
                </Col>
              </Row>
            </Link>
          )}
          <Row className='content-row'>
            <Col className='content' xs='12' sm='6' md='6'>
              <p className='content-title'>Da Lat the city many dreams</p>
              <p className='content-sapo'><em>JudasFate</em>&ensp;07-24-2019</p>
              <p className='content-body'>Da Lat sits approx. 1500 m (4921 ft)
              above sea level on the Lang Biang Plateau in the southern parts of
              the Central Highlands, and is surrounded by lovely mountains, according
              to a local, carry lyrical names like Elephant’s Head and Lady’s Body. So,
              you do not be surprised when someone called Da Lat as The City in the Forest.
              </p>
              <p className='content-footer'>&reg; Social Blog</p>
            </Col>
            <Col className='pad-0' xs='12' sm='6' md='6'>
              <img className='img-resize' src={ImgContent} alt='Images' />
            </Col>
          </Row>
        </Col>
      </>
    )
  }
}

export default Homepage