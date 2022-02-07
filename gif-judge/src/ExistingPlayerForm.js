import React from 'react'

const ExistingPlayerForm = ( {existingPlayerName, changePlayerName, getPlayerByName } ) => {
  return (
    <div>
      <input
        className="ui input game id"
        type="text"
        placeholder="Existing Player Name"
        value={existingPlayerName}
        onChange={changePlayerName}
      />
      <input 
        type="submit"
        value="Submit"
        onClick={getPlayerByName}
      />
    </div>
  )
}

export default ExistingPlayerForm