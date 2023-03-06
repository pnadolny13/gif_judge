import React from 'react';
import './App.css';
import { useParams } from 'react-router-dom';

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
  }

class GameHome extends React.Component {

    constructor() {
      super()
      this.state = {
        gameDetails: {},
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
          <div>Game Details: {JSON.stringify(this.state.gameDetails)}</div>
        )
    }
    
}

export default withParams(GameHome);
