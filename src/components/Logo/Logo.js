import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import "./Logo.css";
import 'tachyons';
const Logo = () => {
    return (
        <Tilt glareEnable={true} tiltMaxAngleX={10} 
        tiltMaxAngleY={10} perspective={1000} 
        glareColor={"rgb(255,0,0)"}>
            <div className='logo'>
                {<img alt='brainlogo' src={brain}></img>}
            </div>
        </Tilt>
    )
}

export default Logo;