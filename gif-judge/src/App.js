import React from 'react';
import './App.css';
import SearchBar from './SearchBar';
import GifCard from './GifCard';
import NewGameForm from './NewGameForm';

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      searchTerm: "",
      gifs: [],
      gameDetails: null,
      gameName: null,
      playerId: null
    }
  }

  changeSearchTerm = (event) => {
    this.setState( {
      searchTerm: event.target.value
    } )
  }

  changeGameId = (event) => {
    this.setState( {
      gameId: event.target.value
    } )
  }

  changeGameName = (event) => {
    this.setState( {
      gameName: event.target.value
    } )
  }

  getGifs = () => {
    fetch("https://qrvdhn4u98.execute-api.us-east-1.amazonaws.com/test/v1/get_gifs", {
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

  getNewGame = () => {
    fetch("https://qrvdhn4u98.execute-api.us-east-1.amazonaws.com/test/v1/game/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, 
      body: JSON.stringify({
        name: this.state.gameName,
        creator_name: "testing"
      })
    })
      .then( resp => resp.json() )
      .then( resp => this.setState( { gameDetails: resp } ) )
  }

  render() {
    return(
      <div>
        {
          this.state.gameDetails ? null: <NewGameForm 
            gameName={this.state.gameName}
            changeGameName={this.changeGameName}
            createGame={this.getNewGame}
          />
        }

        {
          this.state.gameDetails ? <SearchBar 
            searchTerm={this.state.searchTerm}
            changeSearchTerm={this.changeSearchTerm}
            getGifs={this.getGifs}
          /> : null
        }

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