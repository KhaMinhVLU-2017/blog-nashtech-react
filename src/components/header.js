import React, { Component, Fragment } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { connect } from 'react-redux'
import { deleteUser } from '../redux/action'
import { Link } from 'react-router-dom'

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
    this.logout = this.logout.bind(this)
  }
  logout() {
    this.props.deleteUser()
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  render() {
    return (
      <Navbar style={{ width: '100%', position: 'fixed', zIndex: 2 }} color="dark" dark expand="md">
        <NavbarBrand href="/home">Social Blog</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>

              <NavItem>
                <Link className='nav-link' to='/home'>Home</Link>
              </NavItem>
              {this.props.user.fullname &&
              <Fragment>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Blog
                  </DropdownToggle>
                  <DropdownMenu right>
                    <Link className='dropdown-item' to='/home/create'>Create Post</Link>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Fragment>
              }
            {this.props.user.fullname ?
              (<Fragment>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    {this.props.user.fullname}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={this.logout}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Fragment>) :
              (<Fragment>
                <NavItem>
                  <Link className='nav-link' to='/login'>Login</Link>
                </NavItem>
                <NavItem>
                  <Link className='nav-link' to='/register'>Register</Link>
                </NavItem>
              </Fragment>)
            }
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

const mapStatetoprop = (state) => ({
  user: state.user
})

export default connect(mapStatetoprop, { deleteUser })(Header)
