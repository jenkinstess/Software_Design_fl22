import React from 'react'
// import styles from '../styles/Navbar.css'
import Link from 'next/link'
import useSWR from 'swr';
 
const Navbar = () => {
    return (
        <nav className = "Navbar">
            <Link href='/'><a><li>Home</li></a></Link>
            {/* {localStorage.getItem("loggedIn") === "true" ? (
                    <>
                    <Link href='/profile'><a><li>Profile</li></a></Link>
                    <Link href='/'><a><li>Sign Out</li></a></Link>
                    </>
            ):( */}

                    <>
                    <Link href='/login'><a><li>Log In</li></a></Link>
                    <Link href='/signup'><a><li>Sign Up</li></a></Link>
                    <Link href='/buy'><a><li>Buy</li></a></Link>
                    </>
            {/* )} */}
        </nav>
                
    )
}
 
export default Navbar