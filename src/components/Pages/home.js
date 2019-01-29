import React, { Component } from 'react';

import './home.css';

import fetchJsonp from 'fetch-jsonp';
import {Redirect} from 'react-router-dom';

class home extends Component {

  state = {
    shelters: [],
    shelterZ: '',
    shelterN: '',
    formSubmit: false
  }

  findShelters = (e) => {
    e.preventDefault();

    let shelterName = e.target.querySelector('#name').value;
    let shelterZip = e.target.querySelector('#zip').value;
    if (shelterName==='') {shelterName = ' '}
    // this.setState({shelterZ: shelterZip, shelterN: shelterName})

    if(shelterZip === '' || isNaN(shelterZip)) {
        alert('you must enter a zip code at least');
    } else {
        let url = this.buildUrlShelter(shelterName, shelterZip);
        let config = {jsonpCallbackFunction: 'callback'};
        fetchJsonp(url, config)
            .then(res => res.json())
            .then(resJson => {
                let resShelters = resJson.petfinder.shelters.shelter;
                this.setState({shelters: resShelters, shelterZ: shelterZip, shelterN: shelterName});
                this.props.myCallBack(this.state.shelters, shelterName, shelterZip);
                // console.log(resShelters);
                this.setState({formSubmit: true});
                // console.log(this.state.shelterN, this.state.shelterZ);
            })
            .catch(error => {
                console.log('Error occured:', error);
            })
    }
  }

  buildUrlShelter = (name, zip) => {
    let key = "0c3728361f369f16392e5d66b821cb3d";
    let returnUrl = `https://api.petfinder.com/shelter.find?&format=json&key=${key}&location=${zip}&name=${name}&callback=callback&count=15`;
    
    return returnUrl;
  }

    render() {
  
      return (
        <div className="home">
          <section>
            <div>
              <article className="info">
                  <h2>Welcome to Adoption Central!</h2>
                  <p className="description">We love adopting pets as much as you do. We would love to be able to search for animals via shelter instead! By using the form to the right, you'll be able to search for adoption shelters near you!</p>
              </article>
              <form onSubmit={this.findShelters} className="shelterForm">
                  <h3>Find a Shelter Near You!</h3>
                  <div>
                      <label htmlFor="zip">Zip Code:</label>
                      <input type="text" name="zip" placeholder="32792" id="zip"/>
                  </div>
                  <div>
                      <label htmlFor="name">Shelter Name:</label>
                      <input type="text" name="name" placeholder="Its All About the Cats Inc." id="name"/>
                  </div>
                  <div>
                    <button type="submit">Find Shelter!</button>
                    <button type="reset">Clear</button>
                  </div>
              </form>
            </div>
          </section>
          <div>{this.state.formSubmit===false? '':<Redirect to={"shelters/" + this.state.shelterZ + '/' + this.state.shelterN + '/1'}/>}</div>
        </div>
      );
    }
  }
  
  export default home;