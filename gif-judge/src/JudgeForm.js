import React from 'react'

const JudgeForm = ( {judgeId, playerId, phraseFormEntry, changePhrase, postPhrase } ) => {
    if (judgeId === playerId){
        return (
            <div>
            <p>Choose your phrase, once you submit the game will begin</p>
            <input
                className="Judge Phrase"
                type="text"
                placeholder="Phrase"
                value={phraseFormEntry}
                onChange={changePhrase}
            />
            <input 
                type="submit"
                value="Start Game"
                onClick={postPhrase}
            />
            </div>
        )
    } else {
        return null
    }
}

export default JudgeForm