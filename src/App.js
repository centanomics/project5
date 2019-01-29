import React, { Component } from 'react';
// import fetchJsonp from 'fetch-jsonp';
import { HashRouter as Router } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
// import Body from './components/Body/Body';
import Main from './components/Main/Main';

class App extends Component {



  render() {

    return (
      <Router>
      <div className="App">
        <Header />
        <Main />
        <Footer />
      </div>
      </Router>
    );
  }
}

export default App;
