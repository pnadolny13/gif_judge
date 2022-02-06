
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const GameId = ({ match, location }) => {
    const [searchParams] = useSearchParams();
    console.log(searchParams.entries());
  
    return <div>Your Game ID - {searchParams.get("id")}</div>;
};
export default GameId