import React, { Component } from 'react';

import fetchJsonp from 'fetch-jsonp';

import './Body.css';

class Body extends Component {

    state = {
        shelters: [],
        recentShelter: '',
        pets: {id: '', list: []}
    }

    findShelters = (e) => {
        e.preventDefault();

        let shelterName = e.target.querySelector('#name').value;
        let shelterZip = e.target.querySelector('#zip').value;

        if(shelterZip === '' || isNaN(shelterZip)) {
            alert('you must enter a zip code at least');
        } else {
            let url = this.buildUrlShelter(shelterName, shelterZip);
            let config = {jsonpCallbackFunction: 'callback'};
            fetchJsonp(url, config)
                .then(res => res.json())
                .then(resJson => {
                    let resShelters = resJson.petfinder.shelters.shelter;
                    this.setState({shelters: resShelters});
                    console.log(resShelters);
                })
                .catch(error => {
                    console.log('Error occured:', error);
                })
        }
        
    }

    buildUrlShelter = (name, zip) => {
        let key = "0c3728361f369f16392e5d66b821cb3d";
        let returnUrl = `https://api.petfinder.com/shelter.find?&format=json&key=${key}&location=${zip}&name=${name}&callback=callback`;
        
        return returnUrl;
    }

    buildUrlPet = (shelterId) => {
        let key = "0c3728361f369f16392e5d66b821cb3d";
        let returnUrl = `https://api.petfinder.com/shelter.getPets?&format=json&key=${key}&id=${shelterId}&count=4`;

        return returnUrl;
    }

    getShelterPets = (e, shelterId) => {
        e.persist();
        this.setState({recentShelter: shelterId});
        
        let url = this.buildUrlPet(shelterId);
        let config = {jsonpCallbackFunction: 'callback'};
        fetchJsonp(url, config)
            .then(res => res.json())
            .then(resJson => {
                console.log(resJson.petfinder.pets.pet);
                this.setState({pets: {id: shelterId, list: resJson.petfinder.pets.pet}});
                console.log(this.state.pets);
                // this.showPets(e.target.parent);
                // console.log(e.target.parent);
            })
            .catch(error => {
                console.log("Error occured: ", error);
            })
    }

    showPets = () => {
        let pets = this.state.pets;
        let shelter = document.querySelector(pets);
        console.log(shelter);
    }

    render() {
    
        let petKey = 0;
        let petsList = this.state.pets.list.map (pet => {
            petKey++;
            return (
                <p key={petKey}>
                    {pet.name.$t}
                </p>
            )
        });
        let sheltersList = this.state.shelters.map(shelter => {         
            return (
                <article key={shelter.id.$t} className="shelterWrap">
                    <section className="shelters">
                        <h4>{shelter.name.$t} </h4>
                        <p>{shelter.phone.$t==null ? 'No number': shelter.phone.$t}</p>
                        <p>{shelter.email.$t==null ? 'No email': shelter.email.$t} </p>
                        <p>{shelter.city.$t}, {shelter.state.$t} {shelter.zip.$t}</p>
                        <button type="button" onClick={(e) => {this.getShelterPets(e, shelter.id.$t)}}>See Pets</button>
                        <button>More Shelter Info</button>
                    </section>
                    <div>{shelter.id.$t===this.state.pets.id? petsList: ''}</div>
                </article>
            )
        });
  
      return (
        <main className="Body">
            <section>
                <article>
                    <h2>Shelter Finder!</h2>
                    <p>We put the focus on the shelter! Then you can find your pets!</p>
                </article>
                <form onSubmit={this.findShelters}>
                    <div>
                        <label htmlFor="zip">Zip Code:</label>
                        <input type="text" name="zip" placeholder="32792" id="zip"/>
                    </div>
                    <div>
                        <label htmlFor="name">Shelter Name:</label>
                        <input type="text" name="name" placeholder="Its All About the Cats Inc." id="name"/>
                    </div>
                    <button type="submit">Find Shelter!</button>
                    <button type="reset">Clear</button>
                </form>
            </section>
            <section className="resShelter">
                <h3>Shelter Search Results</h3>
                {sheltersList}
            </section>
        </main>
      );
    }
  }
  
  export default Body;