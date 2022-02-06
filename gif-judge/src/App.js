import React, { useEffect } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import GifCard from './GifCard';
import NewGameForm from './NewGameForm';
import GameId from './GameId';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';


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
      playerDetails: {
        "id": ""
      },
      playerName: ""
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
  }

  render() {

    
    if (this.state.gameDetails.id === "") {
      return(
        <div>
          {
            <Router>
              <Routes>
                <Route path="/gif-judge/games/" element={<GameId />} />
                <Route path="" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          }
          {
            <NewGameForm
              gameName={this.state.gameName}
              playerName={this.state.playerName}
              changePlayerName={this.changePlayerName}
              changeGameName={this.changeGameName}
              createGame={this.getNewGame}
            />
          }

        </div>
      )
      
    } else if (this.state.playerDetails.id === "") {
      return (
        <div>
          {
            <SearchBar 
              searchTerm={this.state.searchTerm}
              changeSearchTerm={this.changeSearchTerm}
              getGifs={this.getGifs}
            />
          }
        </div>
      )
    } else {

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