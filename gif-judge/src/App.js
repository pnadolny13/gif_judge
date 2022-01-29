import React from 'react';
import './App.css';
import SearchBar from './SearchBar';
import GifCard from './GifCard';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      searchTerm: "",
      gifs: []
    }
  }

  changeSearchTerm = (event) => {
    this.setState( {
      searchTerm: event.target.value
    } )
  }

  getGifs = () => {
    fetch("http://localhost:8000/v1/get_gifs", {
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
    return(
      <div>
        <SearchBar 
          searchTerm={this.state.searchTerm}
          changeSearchTerm={this.changeSearchTerm}
          getGifs={this.getGifs}
        />

        {
          this.state.gifs.map( gifObj => 
            <GifCard key={gifObj.id} gifObj={gifObj} /> 
          )
        }

      </div>
    )
  }  
}

export default App