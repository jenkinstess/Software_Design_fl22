import React, {Component} from 'react'
import Link from 'next/link';
import { useEffect } from 'react';
// import styles from "../styles/Navbar.css";

export default function Navbar(){ 
    useEffect(() => {
        const loginoutcome = localStorage.getItem("loginoutcome")
    }, [])
       
    return (
        <div className = "Navbar">
                
            <Link href = "/">
                <a>Home</a>
            </Link>   
            {/* {console.log(localStorage.getItem("loginoutcome") === "true")} */}
            {/* {localStorage.getItem("loginoutcome") === "true" ? ( */}
                
            {localStorage.getItem("loginoutcome") === "true" ? (
                <>
                <Link href = "/profile"><a>Profile</a></Link> 
                <Link href = "/buy"><a>Buy</a></Link> 
                <Link href = "/sell"><a>Sell</a></Link> 
                </>
            ):(
        
                <>
                <Link href = "/login"><a>Login</a></Link>
                <Link href = "/signup"><a>Sign Up</a></Link>  
                </>
            )}
        </div>
    )
}