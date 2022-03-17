import React, { useState } from 'react'

import LoginAndRegister from "./Login";

function Home() {

    let [which, setWhich] = useState(true)

    return ( 
        <div className="home">
            <h1><span>(P)</span>ersonal-<span>(LIB)</span>rary</h1>
            <br />
            <h3 style={{ opacity: ".5" }}>Organize your life.</h3>
            <br /><br />
            <LoginAndRegister which={which} />
            <br /><br /><br />
            {which ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setWhich(!which)}>{!which ? "Login" : "Register"}</button>
        </div>
    );
}

export default Home;