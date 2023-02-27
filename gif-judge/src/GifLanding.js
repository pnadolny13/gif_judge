import React from 'react';
import './App.css';
import SearchBar from './SearchBar';
import GifCard from './GifCard';
import GifModal from './GifModal';

class GifLanding extends React.Component {

  constructor() {
    super()
    this.state = {
      searchTerm: "",
      gifs: [],
      selectedGif: null,
      modalIsOpen: false
    }
  }

  changeSearchTerm = (event) => {
    this.setState( {
      searchTerm: event.target.value
    } )
  }

  openModal(gif) {
    this.setState({
        modalIsOpen: true,
        selectedGif: gif
    });
  }

  closeModal() {
      this.setState({
          modalIsOpen: false,
          selectedGif: null
      });
  }

  getGifs = () => {
    fetch(process.env.REACT_APP_REST_API_URL + "v1/get_gifs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, 
      body: JSON.stringify({
        searchTerm: this.state.searchTerm
      })
    })
      .then( resp => resp.json() )
      .then( resp => this.setState( { gifs: resp.data } ) )
  }
  
  render() {

      return (
        <div>
          {
            <SearchBar 
              searchTerm={this.state.searchTerm}
              changeSearchTerm={this.changeSearchTerm}
              getGifs={this.getGifs}
            />
          }

          {
            this.state.gifs.map( gifObj =>
              <GifCard key={gifObj.id} gifObj={gifObj} onGifSelect={selectedGif => this.openModal(selectedGif) } /> 
            )
          }

          {
            <GifModal
              modalIsOpen={this.state.modalIsOpen}
              selectedGif={this.state.selectedGif}
              onRequestClose={ () => this.closeModal() }
            />
          }

        </div>
      )

    // }
  }  
}

export default GifLanding