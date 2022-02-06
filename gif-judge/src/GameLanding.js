
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const GameLanding = ({ match, location }) => {
    const [searchParams] = useSearchParams();
    console.log(searchParams.entries());
  
    if (searchParams.get("id")) {
        return <div>Your Game ID - {searchParams.get("id")}</div>;
    }
    
};
export default GameLanding