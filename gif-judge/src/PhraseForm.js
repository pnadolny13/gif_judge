import React from 'react'

const PhraseForm = ( { phraseInput, changePhrase, submitPhrase } ) => {
  return (
    <div>
      <input 
        className="search"
        type="text"
        placeholder="Game phrase..."
        value={phraseInput}
        onChange={changePhrase}
      />

      <input 
        type="submit"
        value="Submit phrase and start the game!"
        onClick={submitPhrase}
      />
    </div>
  )
}

export default PhraseForm