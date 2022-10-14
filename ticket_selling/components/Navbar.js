import React, {Component} from 'react'
// import styles from "../styles/Navbar.css";

function Navbar(){    
    return (
        <div className = "Navbar">
                
            <Link href = "/">
                <a>Home</a>
            </Link>   
            {console.log(localStorage.getItem("loginoutcome") === "true")}
            {localStorage.getItem("loginoutcome") === "true" ? (
                <>
                <Link href = "/profile"><a>Profile</a></Link> 
                <Link href = "/buy"><a>Buy</a></Link> 
                <Link href = "/sell"><a>Sell</a></Link> 
                {/* <a href = "/" onClick={this.logOut.bind()}>Log Out</a> */}
                </>
            ) : (
      
                <>
                <Link href = "/login"><a>Login</a></Link>
                <Link href = "/signup"><a>Sign Up</a></Link>  
            </>
                
            )}
        </div>
    )
}
export default Home


// export default function Layout(children){
//     return <p>This is our Layout</p>

// }