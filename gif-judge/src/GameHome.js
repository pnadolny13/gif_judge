import React from 'react';
import './App.css';
import { useParams } from 'react-router-dom';
import PhraseForm from './PhraseForm';


function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
  }

class GameHome extends React.Component {

    constructor() {
      super()
      this.state = {
        gameDetails: {},
        phraseInput: '',
        playerId: '22bd4b21-ffb9-4247-a678-83ba0beed02c',
      }
    }

    componentDidMount() {
      const websocket = new WebSocket(process.env.REACT_APP_WS_API_URL)
      this.setState({
        websocket: websocket
      })
      websocket.onmessage = this.onMessage

    }

    onMessage = (ev) => {
      const recv = JSON.parse(ev.data)
      this.setState( { gameDetails: recv } )
    }

    changePhrase = (event) => {
      this.setState( {
        phraseInput: event.target.value
      } )
    }

    submitPhrase = () => {
      fetch(process.env.REACT_APP_REST_API_URL + "v1/game/" + this.state.gameDetails.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }, 
        body: JSON.stringify({
          phrase: this.state.phraseInput
        })
      })
        .then( resp => resp.json() )
        this.setState({
          phraseInput: ''
        })
    }

    getExistingGame = async () => {
        await fetch(process.env.REACT_APP_REST_API_URL + "v1/game/" + this.props.params.gameId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }, 
        })
          .then( resp => resp.json() )
          .then( resp => this.setState( { gameDetails: resp } ) )
      }

    render() {
        if (Object.keys( this.state.gameDetails).length === 0) {
            this.getExistingGame()
        }
        return (
          <div>
            Game Details: {JSON.stringify(this.state.gameDetails)}
            { this.state.gameDetails.judge_player_id === this.state.playerId ?
                <PhraseForm
                  phraseInput={this.state.phraseInput}
                  changePhrase={this.changePhrase}
                  submitPhrase={this.submitPhrase}
                />
                : null
            }
          </div>

        )
    }
    
}

export default withParams(GameHome);
