import React from 'react'

const NewGameForm = ( { gameName, changeGameName, createGame } ) => {
  return (
    <div>
      <input 
        className="ui input search"
        type="text"
        placeholder="New Game Name"
        value={gameName}
        onChange={changeGameName}
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