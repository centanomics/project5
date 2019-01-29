import React, { Component } from 'react';

import './pets.css';
import fetchJsonp from 'fetch-jsonp';
import Modal from 'react-modal';

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
    currPet: {},
    currPage: 1,
    modalIsOpen: false

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
    // console.log(this.props.shelterId, this.props.petList);
    this.setState({petList: this.props.petList, shelterToCall: this.props.shelterId});
    // console.log(this.state.shelterToCall, this.state.petList);
    // let url = this.buildUrlPet(this.props.match.params.shelterId, this.props.match.params.pageNum);
    // let config = {jsonpCallbackFunction: 'callback'};
    // fetchJsonp(url, config)
    //     .then(res => res.json())
    //     .then(resJson => {
    //       let currPets = resJson.petfinder.pets.pet;
            
    //         this.setState({petList: currPets});
    //         // this.props.myCallBack(this.state.shelters);
    //         // console.log(resShelters);
    //         // this.setState({formSubmit: true});
    //     })
    //     .catch(error => {
    //         console.log('Error occured:', error);
    //     })
  }

  buildUrlPet = (shelterId, count) => {
    let key = "0c3728361f369f16392e5d66b821cb3d";
    let returnUrl = `https://api.petfinder.com/shelter.getPets?&format=json&key=${key}&id=${shelterId}&count=10&offset=${count*10}`;

    return returnUrl;
  }

  previous = () => {
    if(this.state.currPage === 1) {
      alert('you\'re on the first page!!');
      console.log(this.state.petList);
    } else {
      let page = this.state.currPage;
      page--;
      let callPage = page;
      // console.log(page);
      if(page === 1) {callPage = 0};
      
      let url = this.buildUrlPet(this.state.shelterToCall, callPage);
      let config = {jsonpCallbackFunction: 'callback'};
      fetchJsonp(url, config)
          .then(res => res.json())
          .then(resJson => {
            let currPets = resJson.petfinder.pets.pet;
              
              this.setState({petList: currPets, currPage: page});
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
    if(this.state.petList.length < 10) {
      alert('you\'re on the last page!!');
    } else {
      let page = this.state.currPage;
      page++;
      // console.log(page);

      let url = this.buildUrlPet(this.state.shelterToCall, this.state.currPage);
      let config = {jsonpCallbackFunction: 'callback'};
      fetchJsonp(url, config)
          .then(res => res.json())
          .then(resJson => {
              let currPets = resJson.petfinder.pets.pet;
              // console.log(currPets);
              this.setState({petList: currPets, currPage: page});
              // this.props.myCallBack(this.state.shelters);
              // console.log(resShelters);
              // this.setState({formSubmit: true});
          })
          .catch(error => {
              console.log('Error occured:', error);
          })
    } 
  }

    render() {
  
      let listOfPets = this.state.petList.map(pet => {

        return(

          <article key={pet.id.$t} onClick={(e) => this.openModal(pet)}>
            <img src={pet.media.photos.photo[3].$t} alt={pet.name.$t + "'s photo"}/>
            <h3>{pet.name.$t}</h3>
          </article>

        )

      });

      return (
        <div className="pets">
          <form>
            Find
          </form>
            <section className="petDisplay">
              {listOfPets}
            </section>
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
            <img src={this.state.currPet.image} alt={this.state.currPet.name + "'s image"}/>
            <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.currPet.name}</h2>
            <p className="modalText">{this.state.currPet.desc===''? '': this.state.desc}</p>
            <button onClick={this.closeModal}>close</button>
          </Modal>
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