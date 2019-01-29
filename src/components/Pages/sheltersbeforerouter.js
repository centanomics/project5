import React, { Component } from 'react';

import fetchJsonp from 'fetch-jsonp';
import Modal from 'react-modal';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Redirect} from 'react-router-dom';

import './shelter.css';

Modal.setAppElement('#root');

class shelters extends Component {

  constructor() {
    super();

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  state = {
    shelList: [],
    shelInfo: {},
    selectedShelter: 'Riff Raff',
    pets: {id: '', list: []},
    modalIsOpen: false,
    goSeePets: false,
    currPage: 1
  }

  openModal(shelter) {
    this.setState({selectedShelter: shelter});
    // console.log(this.state.selectedShelter);
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#000';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {
    this.setState({shelList: this.props.shelterList, shelInfo: this.props.shelterInfo});
  }

  buildUrlPet = (shelterId, count) => {
    let key = "0c3728361f369f16392e5d66b821cb3d";
    let returnUrl = `https://api.petfinder.com/shelter.getPets?&format=json&key=${key}&id=${shelterId}&count=${count}`;

    return returnUrl;
  }

  getShelterPets = (e, shelterId) => {
    e.persist();
    this.setState({recentShelter: shelterId});
    
    let url = this.buildUrlPet(shelterId, 4);
    let config = {jsonpCallbackFunction: 'callback'};
    fetchJsonp(url, config)
        .then(res => res.json())
        .then(resJson => {
            // console.log(resJson.petfinder.pets.pet);
            this.setState({pets: {id: shelterId, list: resJson.petfinder.pets.pet}});
            // console.log(this.state.pets.list.length);
            // this.showPets(e.target.parent);
            // console.log(e.target.parent);
        })
        .catch(error => {
            console.log("Error occured: ", error);
        })
  }

  showAllPets = () => {

    // this.setState({recentShelter: shelterId});
    
    let url = this.buildUrlPet(this.state.pets.id, 10);
    let config = {jsonpCallbackFunction: 'callback'};
    fetchJsonp(url, config)
        .then(res => res.json())
        .then(resJson => {
            let currPets = resJson.petfinder.pets.pet;
            // this.setState({pets: {id: shelterId, list: resJson.petfinder.pets.pet}});
            // console.log(this.state.pets);
            // this.showPets(e.target.parent);
            // console.log(e.target.parent);
            this.props.getAllPets(currPets, this.state.pets.id);
            this.setState({goSeePets: true});
        })
        .catch(error => {
            console.log("Error occured: ", error);
        })
    // console.log(this.state.pets.id);

  }

  previous = () => {
    if(this.state.currPage === 1) {
      alert('you\'re on the first page!!');
    } else {
      let page = this.state.currPage;
      page--;
      let callPage = page;
      // console.log(page);
      if(page === 1) {callPage = 0};
      
      let url = this.buildUrlShelter(this.state.shelInfo.name, this.state.shelInfo.zip, callPage);
      let config = {jsonpCallbackFunction: 'callback'};
      fetchJsonp(url, config)
          .then(res => res.json())
          .then(resJson => {
              let resShelters = resJson.petfinder.shelters.shelter;
              
              this.setState({shelList: resShelters, currPage: page});
              // this.props.myCallBack(this.state.shelters);
              // console.log(resShelters);
              // this.setState({formSubmit: true});
          })
          .catch(error => {
              console.log('Error occured:', error);
          })
    }
  }

  next = () => {
    if(this.state.shelList.length < 15) {
      alert('you\'re on the last page!!');
    } else {
      let page = this.state.currPage;
      page++;
      // console.log(page);

      let url = this.buildUrlShelter(this.state.shelInfo.name, this.state.shelInfo.zip, this.state.currPage);
      let config = {jsonpCallbackFunction: 'callback'};
      fetchJsonp(url, config)
          .then(res => res.json())
          .then(resJson => {
              let resShelters = resJson.petfinder.shelters.shelter;
              this.setState({shelList: resShelters, currPage: page});
              // this.props.myCallBack(this.state.shelters);
              // console.log(resShelters);
              // this.setState({formSubmit: true});
          })
          .catch(error => {
              console.log('Error occured:', error);
          })
    }
  }

  buildUrlShelter = (name, zip, page) => {
    let key = "0c3728361f369f16392e5d66b821cb3d";
    let returnUrl = `https://api.petfinder.com/shelter.find?&format=json&key=${key}&location=${zip}&name=${name}&callback=callback&count=15&offset=${page*15}`;
    
    return returnUrl;
  }

    render() {
      let petKey = 0;
      let maxPet = this.state.pets.list.length;
      let petsList = this.state.pets.list.map (pet => {
          petKey++;
          return (
              <p key={petKey} className="petName">
                  {pet.name.$t}
                  {petKey===maxPet? <button type="button" onClick={()=>this.showAllPets()}>See all Pets</button> : ''}
              </p>
          )
      });

      let sheltersList = this.state.shelList.map(shelter => {        
        return (
            <article key={shelter.id.$t} className="shelterWrap">
                <section className="shelters">
                    <h4>{shelter.name.$t} </h4>
                    <p>{shelter.phone.$t==null ? 'No number': shelter.phone.$t}</p>
                    <p>{shelter.email.$t==null ? 'No email': shelter.email.$t} </p>
                    <p>{shelter.city.$t}, {shelter.state.$t} {shelter.zip.$t}</p>
                    <button type="button" onClick={(e) => {this.getShelterPets(e, shelter.id.$t)}}>See Pets</button>
                    <button type="button" onClick={(e) => this.openModal(shelter.name.$t)}>More Shelter Info</button>
                </section>
                <div>{shelter.id.$t===this.state.pets.id? petsList: ''}</div>
            </article>
        )
    });
    
      return (
        <div className="resShelter">
            {sheltersList}
            <ul className="pagination">
              <li><button onClick={this.previous}>Previous</button></li>
              <li>{this.state.currPage}</li>
              <li><button onClick={this.next}>Next</button></li>
            </ul>
            <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.selectedShelter}</h2>
            
            <button onClick={this.closeModal}>close</button>
          </Modal>
          <div>{this.state.goSeePets===false? '':<Redirect to={'pets/' + this.state.pets.id + '/1'}/>}</div>
        </div>
      );
    }
  }
  
  export default shelters;

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };