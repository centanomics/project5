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
    selectedShelter: {name: {$t: ''}, latitude: {$t: ''}, longitude: {$t: ''}, zip: {$t: ''}, city: {$t: ''}, state: {$t: ''}, phone: {$t: ''}, email: {$t: ''}},
    pets: {id: '', list: []},
    modalIsOpen: false,
    goSeePets: false,
    currPage: 1,
    shelterSearch: {},
    redirect: false,
    pagination: 0
  }

  openModal(shelter) {
    this.setState({selectedShelter: shelter});
    console.log(this.state.selectedShelter);
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
    // this.setState({shelList: this.props.shelterList, shelInfo: this.props.shelterInfo});
    let zip = this.props.match.match.params.zip;
    let name = this.props.match.match.params.name;
    let pageNum = Number(this.props.match.match.params.pageNum);
    this.setState({redirect: false});

    localStorage.setItem('shelterLink', `/shelters/${zip}/${name}/${pageNum}`);
    this.buildUrlShelter(name, zip, pageNum);
    // console.log(this.props.match.match.params);
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

  showAllPets = (shelterId) => {

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
            this.setState({goSeePets: true, recentShelter: shelterId});
            this.props.getAllPets(currPets, this.state.pets.id);
            
        })
        .catch(error => {
            console.log("Error occured: ", error);
        })
    // console.log(this.state.pets.id);

  }

  previous = () => {
    if(this.state.currPage === 1) {
      this.setState({redirect: false, pagination: 0});
      alert('you\'re on the first page!!');
    } else {
      let page = this.state.currPage;
      page--;
      
      this.buildUrlShelter(this.state.shelterSearch.name, this.state.shelterSearch.zip, page);
      localStorage.setItem('shelterLink', `/shelters/${this.state.shelterSearch.zip}/${this.state.shelterSearch.name}/${page}`);
      this.setState({pagination: 1});
    }
  }

  next = () => {
    if(this.state.shelList.length < 15) {
      this.setState({redirect: false, pagination: 2});
      alert('you\'re on the last page!!');
    } else {
      let page = this.state.currPage;
      page++;
      // console.log(page);
      this.buildUrlShelter(this.state.shelterSearch.name, this.state.shelterSearch.zip, page);
      localStorage.setItem('shelterLink', `/shelters/${this.state.shelterSearch.zip}/${this.state.shelterSearch.name}/${page}`);
      this.setState({pagination: 1});
    }
  }

  buildUrlShelter = (name, zip, page) => {
    let key = "0c3728361f369f16392e5d66b821cb3d";
    let returnUrl = `https://api.petfinder.com/shelter.find?&format=json&key=${key}&location=${zip}&name=${name}&callback=callback&count=15&offset=${(page-1)*15}`;
    let config = {jsonpCallbackFunction: 'callback'};
      fetchJsonp(returnUrl, config)
          .then(res => res.json())
          .then(resJson => {
              let resShelters = resJson.petfinder.shelters.shelter;
              this.setState({shelList: resShelters, currPage: page, shelterSearch: {name, zip}, redirect: true});
              // this.props.myCallBack(this.state.shelters);
              // console.log(resShelters);
              // this.setState({formSubmit: true});
          })
          .catch(error => {
              console.log('Error occured:', error);
          })
  }

    render() {
      let petKey = 0;
      let maxPet = this.state.pets.list.length;
      let petsList = this.state.pets.list.map (pet => {
          petKey++;
          return (
              <article key={petKey} className="petName">
                  <div>
                    <div class="peticon"><img src={pet.media.photos.photo[1].$t} alt={pet.name.$t + "'s picture"}/></div>
                    <h4>{pet.name.$t}</h4>
                  </div>
              </article>
          )
      });

      let sheltersList = this.state.shelList.map(shelter => {        
        return (
            <article key={shelter.id.$t} className="shelterWrap">
                <section className="shelters">
                    <h4>{shelter.name.$t} </h4>
                    <p>{shelter.city.$t}, {shelter.state.$t} {shelter.zip.$t}</p>
                    <button type="button" onClick={(e) => {this.getShelterPets(e, shelter.id.$t)}}>See Pets</button>
                    <button type="button" onClick={(e) => this.openModal(shelter)}>More Shelter Info</button>
                    <button type="button" onClick={()=>this.showAllPets(shelter.id.$t)}>See all Pets</button>
                </section>
                <div className="shelterPets">{shelter.id.$t===this.state.pets.id? petsList: ''}</div>
            </article>
        )
    });
    
      return (
        <div className="resShelter">
            {sheltersList}
            <ul className="pagination">
              <li><button onClick={this.previous} id={this.state.pagination===0? 'begin': ''}>Previous</button></li>
              <li>{this.state.currPage}</li>
              <li><button onClick={this.next} id={this.state.pagination===2? 'end': ''}>Next</button></li>
            </ul>
            <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            >
            <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.selectedShelter.name.$t}</h2>
            <p>{this.state.selectedShelter.phone.$t==null ? 'No number': this.state.selectedShelter.phone.$t}</p>
            <p>{this.state.selectedShelter.email.$t==null ? 'No email': this.state.selectedShelter.email.$t} </p>
            <p>{this.state.selectedShelter.city.$t}, {this.state.selectedShelter.state.$t} {this.state.selectedShelter.zip.$t}</p>
            <a href={"https://maps.google.com/?q="+ this.state.selectedShelter.latitude.$t +"," + this.state.selectedShelter.longitude.$t}>Find this shelter on a map!</a><br/>
            <button onClick={this.closeModal}>close</button>
            </Modal>
          <div>{this.state.goSeePets===false? '':<Redirect to={'../../../pets/' + this.state.recentShelter + '/1'}/>}</div>
          <div>{this.state.redirect? <Redirect to={'../../' + this.state.shelterSearch.zip + '/' + this.state.shelterSearch.name + '/' + this.state.currPage}/> : ''}</div>
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