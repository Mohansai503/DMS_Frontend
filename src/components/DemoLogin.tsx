import React, { useState } from "react";


function DemoGreeting() {

    const [name, setname] = useState("");

    return(
        <div>
            <input type="text" placeholder="Enter name"
            onChange={(e) => setname(e.target.value)} />

            <h1>Hello {name}</h1>
        </div>
    );
}

export default DemoGreeting;