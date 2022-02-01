import React from 'react'

const NewGameForm = ( { gameName, playerName, changePlayerName, changeGameName, createGame } ) => {
  return (
    <div>
      <input
        className="ui input game name"
        type="text"
        placeholder="New Game Name"
        value={gameName}
        onChange={changeGameName}
      />
      <input
        className="ui input creator name"
        type="text"
        placeholder="Creator Player Name"
        value={playerName}
        onChange={changePlayerName}
      />
      <input 
        type="submit"
        value="Submit"
        onClick={createGame}
      />
    </div>
  )
}

export default NewGameForm