import React from 'react'

const GifCard = ( { gifObj } ) => {
  return (
    <div className="ui card" >
      <img src={gifObj.images.downsized.url} alt="gif"/>
      {/* onClick={getGifs} */}

    </div>
  )
}

export default GifCard