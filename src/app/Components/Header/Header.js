import './Header.css';
import logo from '../../assets/Majlis-blue-nobg.png';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { URL as url } from '../../settings';
import { useQuery } from 'react-query';
import { jwtDecode } from 'jwt-decode';
import ButtonLoader from '../Loaders/ButtonLoader/ButtonLoader';

export default function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [show, setShow] = useState(true);
    const [show2, setShow2] = useState(true);
    const Dtoken = useRef(null);
    const location = useLocation();
    const nav = useNavigate();

    const {data, isLoading, isError} = useQuery(['getPFP'], async () => {
        const response = await fetch(`${url}/users/getPFP`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok){
            setLoggedIn(true)
        }
        else{
            setLoggedIn(false);
            localStorage.removeItem('token')
            localStorage.removeItem('username')
        }
        return response.ok ? response.json() : null;
    });

    useEffect(() => {
        if (isError) {
            setLoggedIn(false);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
    }, [isError]);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        setShow(!location.pathname.includes('/login') && !location.pathname.includes('/register'));
        setShow2(!location.pathname.includes('/create') && !location.pathname.includes('/user-profile'));

        if ((!token || !loggedIn) && location.pathname.includes('/create')){
            nav('/')
        }
    }, [location.pathname])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (loggedIn && token) {
            const decoded = jwtDecode(token);
            localStorage.setItem('username', decoded['username']);
            Dtoken.current = decoded;
        }
    }, [loggedIn, localStorage.getItem('token')]);

    return (
        <>
            <header>
                <Link to={'/'}><img src={logo} alt='logo' className='logo-img'></img></Link>
                {show ? (
                    isLoading? <ButtonLoader/>:
                        loggedIn ? (
                            <div className='header-user-profile'>
                                <Link to={`/user-profile?id=${Dtoken?.current?.id}`}><img className='header-pfp' src={`data:image/png;base64,${data}`} alt='profile' /></Link>
                                <div class="tooltiptext">{localStorage.getItem('username')}</div>
                            </div>
                        ) : (
                            <div className='not-loggedin-header'>
                                <Link to={'/login'}>
                                    <button className='header-login-btn'>Log-in</button>
                                </Link>
                                <Link to={'/register'}>
                                    <button className='header-signup-btn'>Register</button>
                                </Link>
                            </div>
                        )
                    ) : null}
            </header>
            {show && show2?
                <Link to={loggedIn?'/create':'/login'}>
                    <div className='createPostBtn'>
                        <span class="post-btn-icon material-symbols-outlined">edit</span>
                        <h2 className='post-btn-txt'>Create</h2>
                    </div>
                </Link>:
                null
            }
        </>
    );
}