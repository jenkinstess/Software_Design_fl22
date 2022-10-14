import React, {Component} from 'react'
// import styles from "../styles/Navbar.css";

export default function Navbar(){    
    return <>
        <div className = "Navbar">
                
            <a href = "/">Home</a>
            {console.log(localStorage.getItem("loginoutcome") === "true")}
            {localStorage.getItem("loginoutcome") === "true" ? (
                <>
                <a href = "/recommendations">Recommendations</a>
                <a href = "/profile">Profile</a>
                <a href = "/savedPackages">Saved Packages</a>
                <a href = "/" onClick={this.logOut.bind()}>Log Out</a>
                </>
            ) : (
      
                <>
                <a href = "/login" >Login</a>
                <a href = "/register">Register</a>
            </>
                
            )}
        </div>
    </>
}


// export default function Layout(children){
//     return <p>This is our Layout</p>

// }