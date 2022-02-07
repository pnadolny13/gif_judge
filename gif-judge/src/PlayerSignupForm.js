import React from 'react'

const PlayerSignupForm = ( {playerName, changePlayerName, createPlayer } ) => {
  return (
    <div>
      <input
        className="ui input player name"
        type="text"
        placeholder="New Player Name"
        value={playerName}
        onChange={changePlayerName}
      />
      <input 
        type="submit"
        value="Submit"
        onClick={createPlayer}
      />
    </div>
  )
}

export default PlayerSignupForm