import React, { useState } from 'react'

import LoginAndRegister from "./Login";

function Home() {

    let [which, setWhich] = useState(true)

    return ( 
        <div className="home">
            <h1><span>(</span>p<span>)</span>ersonal - <span>(</span>lib<span>)</span>rary</h1>
                <h3>Organize your life.</h3>
                <br/>
            <div className="load-spot"></div>

            <LoginAndRegister which={which} />
     <br/><br/>
        <p>{which ? "Don't have an account? " : "Already have an account? "} <span onClick={() => setWhich(!which)} style={{ textDecoration: "underline", cursor: "pointer" }}>{!which ? "Login" : "Register"}</span></p>
            
      
        </div>
    );
}

export default Home;