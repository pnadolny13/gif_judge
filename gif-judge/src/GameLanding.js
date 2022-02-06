
import React from 'react';
import NewGameForm from './NewGameForm';
import ExistingGameForm from './ExistingGameForm';
import GameID from './GameID';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from 'react-router-dom';

const GameLanding = (
    newGameFlag,
    gameId,
    gameName,
    playerName,
    changePlayerName,
    changeGameName,
    changeGameId,
    changeNewGameFlag,
    getNewGame,
    getExistingGame
) => {
    if (newGameFlag === "") {
      return(
          <div>
            {
              <div>
                  <input 
                    type="submit"
                    value="Create New Game"
                    onClick={changeNewGameFlag}
                  />
              </div>
            }
            {
              <Router>
                <Routes>
                  <Route path="/gif-judge/games/" element={<GameID />} />
                  <Route path="" element={<Navigate to="//gif-judge/" />} />
                </Routes>
              </Router>
            }
            {
              <ExistingGameForm
                  gameId={gameId}
                  changeGameId={changeGameId}
                  getExistingGame={getExistingGame}
              />
            }
          </div>
        )
    } else {
      return(
        <div>
          {
            <NewGameForm
              gameName={gameName}
              playerName={playerName}
              changePlayerName={changePlayerName}
              changeGameName={changeGameName}
              createGame={getNewGame}
            />
          }
        </div>
      )
    }
    
};
export default GameLanding