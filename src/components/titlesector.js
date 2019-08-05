import React from 'react'
import { Col } from 'reactstrap'
function Titlesector(props) {
  return (
    <Col className='sector' xs='12' sm='12' md='12'>
      <h3 className='sector-title'>
        {props.title}
      </h3>
    </Col>
  )
}

export default Titlesector
