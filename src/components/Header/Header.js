import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './Header.css';

class Header extends Component {

  state = {
    currentPage: ''
  }

  updateNav = (e, pageName) => {
    // console.log(e.target);
    this.setState({currentPage: pageName});
  }

    render() {
  
      return (
        <header className="Header">
            <h1 className="title" onClick={(e) => this.updateNav(e, '')} ><NavLink to="/home">Adoption Central</NavLink></h1>
            <ul className="navigation">
              <li 
                onClick={(e) => this.updateNav(e, 'shelters')} 
                className={this.state.currentPage==='shelters'? 'selected':''}>
                <NavLink to={localStorage.getItem('shelterLink') ? localStorage.getItem('shelterLink'):'/shelters'}>Shelters</NavLink></li>
              <li 
                onClick={(e) => this.updateNav(e, 'pets')}
                className={this.state.currentPage==='pets'? 'selected':''}>
                <NavLink to={localStorage.getItem('petLink') ? localStorage.getItem('petLink'): '/pets'}>Pets</NavLink></li>
            </ul>
        </header>
      );
    }
  }
  //shelters
  //pets
  export default Header;