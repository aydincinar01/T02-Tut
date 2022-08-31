import React from "react"; 
import { Link } from "react-router-dom";

function PageNotFound() {

    return (<div>
        <h1>PageNotFound !</h1>
        <h2>Try this liknk : <Link to="/">Home</Link></h2>
        </div>);
}

export default PageNotFound;
