import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';
const alertifyjs = require('alertifyjs');
const sessionStorage = window.sessionStorage;


export default class Header extends Component{
    constructor(props){
      super(props);
      this.state = {
        loggedInAs:sessionStorage.getItem("name"),
        show:true
      }
    }
    logout() {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('first_name');
      alertifyjs.message('Loggin out', 5, function(){  console.log('dismissed'); });
      window.location.href="/";
    }
    render(){
        return(
       <nav className="headerNav navbar navbar-default navbar-static-top">
      <div className="container-fluid">
        <div id="navbar" className="">
          <ul className="profileNav nav navbar-nav navbar-right">
          <DropdownButton
            title={<FontAwesomeIcon icon={faUser}/>}
            // key={i}
            // id={`dropdown-basic-${i}`}
          >
          <a onClick={this.logout} eventKey="1">Logout</a>
          </DropdownButton>
          {/* <button type="button" className="btn pull-left">
          <FontAwesomeIcon icon={faUser}/>
          </button>
              <NavDropdown eventKey={3} title={this.state.loggedInAs} id="basic-nav-dropdown">
                <li  eventKey={3.4}>Logout</li>
    </NavDropdown> */}
          </ul>
        </div>
      </div>
    </nav>

        );
    }


}