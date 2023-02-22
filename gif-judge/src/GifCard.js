import React from 'react'

const GifCard = ( { gifObj, onGifSelect } ) => {
  return (
    <div className="gif-item" >
      <img src={gifObj.images.downsized.url} alt="gif" onClick={() => onGifSelect(gifObj)}/>

    </div>
  )
}

export default GifCard