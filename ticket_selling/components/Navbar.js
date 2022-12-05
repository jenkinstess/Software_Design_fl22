import React from 'react'
// import styles from '../styles/Navbar.css'
import Link from 'next/link'
import useSWR from 'swr';
import cookie from 'js-cookie';
import Router from 'next/router';

const Navbar = () => {
    const { data, revalidate } = useSWR('/api/me', async function (args) {
        const res = await fetch(args);
        return res.json();
    }, { refreshInterval: 10 });
    if (!data) return <h1>Loading...</h1>;
    let loggedIn = false;
    if (data.email) {
        loggedIn = true;

    }
    return (
        <>
            <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                {loggedIn && (
                    <div class="container-fluid">
                            <li class="nav-item m-2">
                                <Link href='/' ><a style={{ "text-decoration": "none", "color": "white" }} class='navbar-brand active'>WashU Party Tix</a></Link>
                            </li>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                                <ul class="navbar-nav align-items-center ms-auto">
                                <li class="nav-item mr-2">
                                    <Link href='/buy'>
                                        <a style={{ "text-decoration": "none", "color": "white" }} class='nav-link text-align-right'>Buy</a>
                                    </Link>
                                </li>
                                <li class="nav-item mr-2">
                                    <Link href='/sell'>
                                        <a style={{ "text-decoration": "none", "color": "white" }} class='nav-link active text-align-right'>Sell</a>
                                    </Link>
                                </li>
                                <li class="nav-item mr-2">
                                    <Link href='/profile'>
                                        <a style={{ "text-decoration": "none", "color": "white" }} class='nav-link text-align-right'>Profile</a>
                                    </Link>
                                </li>
                                <button
                                    class="btn btn-link"
                                    style={{ "text-decoration": "none", "color": "white" }}
                                    onClick={() => {
                                        cookie.remove('token');
                                        Router.push("/")
                                        revalidate;
                                    }}>
                                    Logout
                                </button>
                                </ul>
                            </div>
                    </div>
                )}
                {!loggedIn && (
                    
                    <>
                    <div class="container-fluid">
                            <li class="nav-item m-2">
                                <Link href='/' ><a style={{ "text-decoration": "none", "color": "white" }} class='navbar-brand active'>WashU Party Tix</a></Link>
                            </li>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                                <ul class="navbar-nav align-items-center ms-auto">
                                <li class="nav-item mr-2">
                                    <Link href='/signup'>
                                        <a style={{ "text-decoration": "none", "color": "white" }} class='nav-link text-align-right'>Signup</a>
                                    </Link>
                                </li>
                                <li class="nav-item mr-2">
                                    <Link href='/login'>
                                        <a style={{ "text-decoration": "none", "color": "white" }} class='nav-link active text-align-right'>Login</a>
                                    </Link>
                                </li>
                                </ul>
                            </div>
                    </div>
                    </>
                )}
            </nav>
        </>

    )
}

export default Navbar