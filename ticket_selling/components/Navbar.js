import React from 'react'
// import styles from '../styles/Navbar.css'
import Link from 'next/link'
import useSWR from 'swr';
 
const Navbar = () => {
    const {data, revalidate} = useSWR('/api/me', async function(args) {
        const res = await fetch(args);
        return res.json();
        },{refreshInterval:10});
        if (!data) return <h1>Loading...</h1>;
            let loggedIn = false;
        if (data.email) {
            loggedIn = true;

        }
    return (
        <nav className = "Navbar">
            {loggedIn && (
                <>
                <Link href='/'><a><li>Home</li></a></Link>
                <Link href='/sell'><a><li>Sell Tickets</li></a></Link>
                <Link href='/buy'><a><li>Buy</li></a></Link>
                <Link href='/profile'><a><li>Profile</li></a></Link>
                </>     
            )}
            {!loggedIn && (
                <>
                <Link href='/login'><a><li>Log In</li></a></Link>
                <Link href='/signup'><a><li>Sign Up</li></a></Link>
                </>     
            )}
        </nav>
                
    )
}
 
export default Navbar