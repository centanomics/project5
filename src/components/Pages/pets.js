import React, { Component } from 'react';

// import queryString from 'query-string';
import './pets.css';
import fetchJsonp from 'fetch-jsonp';
import Modal from 'react-modal';
import {Redirect} from 'react-router-dom';

class pets extends Component {

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  state = {

    petList: [],
    shelterToCall: '',
    shelterInfo: {name: {$t: ''}},
    currPet: {},
    currPage: 1,
    modalIsOpen: false,
    redirect: 0,
    pagination: 0

  }

  openModal(pet) {
    this.setState({currPet: {name: pet.name.$t, image: pet.media.photos.photo[2].$t, desc: pet.description.$t}});
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
    // this.setState({petList: this.props.petList, shelterToCall: this.props.shelterId});

    let id = this.props.match.params.shelterId;
    let num = Number(this.props.match.params.pageNum);
    // console.log(id, num);
    // console.log(id);
    localStorage.setItem('petLink', `/pets/${id}/${num}`);
    this.buildUrlPet(id, num);
  }

  getShelter = (id) => {
    let key = "0c3728361f369f16392e5d66b821cb3d";
    let url = `https://api.petfinder.com/shelter.get?&format=json&key=${key}&id=${id}`;
    let config = {jsonpCallbackFunction: 'callback'};
      fetchJsonp(url, config)
          .then(res => res.json())
          .then(resJson => {
              let resShelters = resJson.petfinder.shelter;
              // this.setState({shelList: resShelters, currPage: page, shelterSearch: {name, zip}, redirect: true});
              // this.props.myCallBack(this.state.shelters);
              console.log(resShelters);
              this.setState({shelterInfo: resShelters});
              // this.setState({formSubmit: true});
          })
          .catch(error => {
              console.log('Error occured:', error);
          })
  }

  buildUrlPet = (shelterId, count) => {
    let key = "0c3728361f369f16392e5d66b821cb3d";
    let returnUrl = `https://api.petfinder.com/shelter.getPets?&format=json&key=${key}&id=${shelterId}&count=10&offset=${(count-1)*10}`;

    let config = {jsonpCallbackFunction: 'callback'};
    fetchJsonp(returnUrl, config)
        .then(res => res.json())
        .then(resJson => {
          let currPets = resJson.petfinder.pets.pet;
            console.log(currPets);
            this.setState({shelterToCall: shelterId ,petList: currPets, currPage: count});
            this.getShelter(shelterId);
            // console.log()
            // this.props.myCallBack(this.state.shelters);
            // console.log(resShelters);
            // this.setState({formSubmit: true});
        })
        .catch(error => {
            console.log('Error occured:', error);
        });
  }

  previous = () => {
    if(this.state.currPage === 1) {
      this.setState({redirect: 0, pagination: 0});
      alert('you\'re on the first page!!');
      // console.log(this.state.petList);
    } else {
      let page = this.state.currPage;
      page--;
      this.buildUrlPet(this.state.shelterToCall, page);
      this.setState({currPage: page, redirect: 1, pagination: 1});
      localStorage.setItem('petLink', `/pets/${this.state.shelterToCall}/${page}`);
      // this.forceUpdate();

      // console.log("pets/" + this.state.shelterToCall + '/' + page);
    }
  }

  next = () => {
    if(this.state.petList.length < 10) {
      this.setState({redirect: 0, pagination: 2});
      alert('you\'re on the last page!!');
    } else {
      let page = this.state.currPage;
      page++;
      this.buildUrlPet(this.state.shelterToCall, page);
      // console.log(page);
      this.setState({currPage: page, redirect: 1, pagination: 1});
      // this.forceUpdate();
      localStorage.setItem('petLink', `/pets/${this.state.shelterToCall}/${page}`);
      
      // console.log("pets/" + this.state.shelterToCall + '/' + page);
    } 
  }

    render() {
  
      let listOfPets = this.state.petList.map(pet => {

        return(

          <article key={pet.id.$t} onClick={(e) => this.openModal(pet)} className="petLists">
            <div>
            <img src={pet.media.photos === undefined ? 'no photo available' : pet.media.photos.photo[3].$t} alt={pet.name.$t + "'s photo"}/></div>
            <h3>{pet.name.$t}</h3>
          </article>

        )

      });

      return (
        <div className="pets">
            <section className="shelterDisplay">
              <h2>{this.state.shelterInfo['name'].$t}</h2>
            </section>
            <section className="petDisplay">
              {listOfPets}
            </section>
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
            <img src={this.state.currPet.image === undefined? 'no photo': this.state.currPet.image} alt={this.state.currPet.name + "'s image"} className="modalImg"/>
            <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.currPet.name}</h2>
            <p className="modalText">{this.state.currPet.desc===''? '': this.state.currPet.desc}</p>
            <button onClick={this.closeModal}>close</button>
          </Modal>
          <div>
          {this.state.redirect===1?<Redirect to={"../" + this.state.shelterToCall + '/' + this.state.currPage}/>:''}
          </div>
        </div>
      );
    }
  }
  
  export default pets;

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