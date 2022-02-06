import React from 'react';
import './App.css';
import SearchBar from './SearchBar';
import GifCard from './GifCard';
import GameLanding from './GameLanding';
import PlayerSignupForm from './PlayerSignupForm';


class App extends React.Component {

  constructor() {
    super()
    this.state = {
      searchTerm: "",
      gifs: [],
      gameDetails: {
        "id": ""
      },
      gameName: "",
      gameId: "",
      playerDetails: {
        "id": ""
      },
      playerName: "",
      newGameFlag: "",
      roundStarted: false,
      gamePlayers: []
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

  changePlayerName= (event) => {
    this.setState( {
      playerName: event.target.value
    } )
  }

  changeNewGameFlag= (event) => {
    this.setState( {
      newGameFlag: event.target.value
    } )
  }
  
  getGifs = () => {
    fetch(process.env.REACT_APP_API_URL + "v1/get_gifs", {
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

  getExistingGame = async () => {
    fetch(process.env.REACT_APP_API_URL + "v1/game/" + this.state.gameId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, 
    })
      // TODO: error handling
      .then( resp => resp.json() )
      .then( resp => this.setState( { gameDetails: resp } ) )

  }

  getNewGame = async () => {
    await fetch(process.env.REACT_APP_API_URL + "v1/game/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, 
      body: JSON.stringify({
        name: this.state.gameName
      })
    })
      .then( resp => resp.json() )
      .then( resp => this.setState( { gameDetails: resp } ) )

    this.createPlayer()
  }

  createPlayer = async () => {
    fetch(process.env.REACT_APP_API_URL + "v1/game/" + this.state.gameDetails.id + "/player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, 
      body: JSON.stringify({
        name: this.state.playerName
      })
    })
      .then( resp => resp.json() )
      .then( resp => this.setState( { playerDetails: resp } ) )
    
    this.getGamePlayers()
  }

  getGamePlayers = async () => {
    fetch(process.env.REACT_APP_API_URL + "v1/game/" + this.state.gameDetails.id + "/players", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, 
    })
      // TODO: error handling
      .then( resp => resp.json() )
      .then( resp => this.setState( { gamePlayers: resp } ) )

  }

  render() {

    
    if (this.state.gameDetails.id === "") {
      return GameLanding(
              this.state.newGameFlag,
              this.state.gameId,
              this.state.gameName,
              this.state.playerName,
              this.changePlayerName,
              this.changeGameName,
              this.changeGameId,
              this.changeNewGameFlag,
              this.getNewGame,
              this.getExistingGame
            )
    } else if (this.state.playerDetails.id === "") {
      return (
        <div>
          {
            <PlayerSignupForm
              playerName={this.state.playerName}
              changePlayerName={this.changePlayerName}
              createPlayer={this.createPlayer}
            />
          }
        </div>
      )
    } else if (this.state.roundStarted === false) {
      
      return(
        <div>
        {this.state.gamePlayers.map(function(d, idx){
          return (<li key={idx}>{d.name} - {d.game_score}</li>)
        })}
        </div>
      )
    
    }  else {

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
              <GifCard key={gifObj.id} gifObj={gifObj} /> 
            )
          }

        </div>
      )

    }
  }  
}

export default App