import React from 'react'

const SearchBar = ( { searchTerm, changeSearchTerm, getGifs } ) => {
  return (
    <div>
      <input 
        className="search"
        type="text"
        placeholder="Search powered by Giphy..."
        value={searchTerm}
        onChange={changeSearchTerm}
      />

      <input 
        type="submit"
        value="Hit Me with Some GIFs!"
        onClick={getGifs}
      />
    </div>
  )
}

export default SearchBar