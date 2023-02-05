import React from 'react'
import GetFunded from './getFunded';

const Welcome = () => {
    return (
        <div className='homeContainer'>
            <h1>
                Fund me with ethereum,<br/> totally anonymous fundraisers
            </h1>
            <h3>
                Sell anything, or accept a donation any time you want.
                <br/>
                Get startted by creating your own fundraiser:
            </h3>
            <GetFunded/>
        </div>
    );
}

export default Welcome