import React from 'react'

const NewGameForm = ( { gameId, changeGameId, getExistingGame } ) => {
  return (
    <div>
      <input
        className="ui input game id"
        type="text"
        placeholder="Existing Game ID"
        value={gameId}
        onChange={changeGameId}
      />
      <input 
        type="submit"
        value="Submit"
        onClick={getExistingGame}
      />
    </div>
  )
}

export default NewGameForm