import React, { Component } from 'react';

import './Footer.css';

class Footer extends Component {

    render() {
  
      return (
        <footer className="footer">
            <span>Copyright © 2019</span>
            <ul>
              <li><a href='http://twitter.com' id="twitter">Twitter</a></li>
              <li><a href='http://facebook.com' id="facebook">Facebook</a></li>
              <li><a href='http://instagram.com' id="instagram">Instagram</a></li>
            </ul>
        </footer>
      );
    }
  }
  
  export default Footer;