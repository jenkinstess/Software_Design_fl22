import React, {Component} from 'react'
import Link from 'next/link';
import { useEffect } from 'react';
// import styles from "../styles/Navbar.css";

export default function Navbar(){ 
    // this.state = {
    //     loginoutcome: true
    // };
    
       
    return (
        <div className = "Navbar">
                
            <Link href = "/">
                <a>Home</a>
            </Link>   
            {/* {console.log(localStorage.getItem("loginoutcome") === "true")} */}
            {/* {localStorage.getItem("loginoutcome") === "true" ? ( */}
                
            {/* {localStorage.getItem("loginoutcome") === "true" ? ( */}
                <>
                <Link href = "../pages/profile">Profile</Link> 
                {/* <Link href = "/buy"><a>Buy</a></Link> 
                <Link href = "/sell"><a>Sell</a></Link>  */}
                </>
            {/* ):( */}
        
                <>
                <Link href = "../pages/login">Login</Link>
                <Link href = "../pages/signup">Sign Up</Link>  
                </>
            {/* )} */}
        </div>
    )
}