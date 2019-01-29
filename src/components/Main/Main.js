import React, { Component } from 'react';

import './Main.css';

import {Route} from 'react-router-dom';

import Home from '../Pages/home';
import Shelter from '../Pages/shelters';
import Pets from '../Pages/pets';

class Main extends Component {

  state = {
    shelters: [],
    shelterInfo: {},
    petList: [],
    petsFrom: ''
  }

  callBackShelter = (homeShelters, shelterName, shelterId) => {
    this.setState({shelters: homeShelters, shelterInfo: {name: shelterName, zip: shelterId}});
    // console.log(this.state.shelters);
  }

  setShelter = (pets, shelterId) => {
    this.setState({petList: pets, petsFrom: shelterId});
  }

  render() {

    return (
      <div className="Main">
          <Route exact path="/" render={() => <Home myCallBack={this.callBackShelter}/>} />
          <Route exact path="/home" render={() => <Home myCallBack={this.callBackShelter}/>} />
          <Route exact path="/shelters/:zip?/:name?/:pageNum?" render={(match) => <Shelter match={match} shelterList={this.state.shelters} getAllPets={this.setShelter} shelterInfo={this.state.shelterInfo}/>} />
          <Route 
            exact 
            path="/pets/:shelterId?/:pageNum?" 
            location={this.props.location} 
            render={({ 
                location, 
                match 
            }) => (
                <Pets match={match} petList={this.state.petList} shelterId={this.state.petsFrom}/>
            )} 
          />
      </div>
    );
  }
}
  
  export default Main;