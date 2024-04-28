import '../Form.css'
import logo from '../../../assets/Majlis-blue-nobg.png'
import { useEffect, useRef, useState } from 'react';
import ButtonLoader from '../../Loaders/ButtonLoader/ButtonLoader';
import { validateEmail, checkPass } from '../../../utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import { URL } from '../../../settings';

export default function LoginForm (){
    const email = useRef();
    const pass = useRef();
    const [isLoading, setLoading] = useState(false);
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");
    const nav = useNavigate();

    async function fetchData() {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/users/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email.current.value, password: pass.current.value })
            });
            const data = await response.json()
            if (response.status === 200){
                localStorage.setItem("token", data['token']);
                nav('/')
            }
            else if (response.status === 401){
                setError2(data['detail']);
            }
            else if (!response.ok) {
                throw new Error('Failed to log in');
            }
            
            // Handle successful response here if needed
        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setLoading(false); 
        }
    }

    function handleSubmit(){
        setError1('')
        setError2('')
        let validEmail = validateEmail(email.current.value);
        let validPass = checkPass(pass.current.value);

        if (validEmail && validPass){
            fetchData()
        }
        if (!validEmail){
            setError1('Please Enter a Valid Email')
        }
        if (!validPass){
            setError2('Please Enter a Password')
        }
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          handleSubmit()
        }
    }

    useEffect(()=>{
        email.current.focus()
    }, [])

    return (
        <div className='login-form-cont' onKeyPress={handleKeyPress}>
            <img src={logo} alt={'logo'} className='form-logo'></img>            
            <h1 className='form-title'>Log-in</h1>
            <input 
                type='email' 
                ref={email}
                autoComplete='off' 
                autoCorrect='off' 
                required={true}
                placeholder='Email' 
                className='form-input'
            />
            <div className='error-cont'>
                <p className={error1 === ''?'no-error':'error'}>{error1}</p>
            </div>

            <input type='password' ref={pass} autoComplete='off' autoCorrect='off' required={true} placeholder='Password' className='form-input'/>
            <div className='error-cont'>
                <p className={error2 === ''?'no-error':'error'}>{error2}</p>
            </div>
            <button onClick={handleSubmit} onKeyPress={handleKeyPress} disabled={isLoading?true:false} type='submit' className={isLoading? 'loading-button' :'form-button'}>
                {isLoading?<ButtonLoader></ButtonLoader>:<>Log-in</>}
            </button>
            <p className='account-txt'>Don't have an account? <Link className='redirect-txt' to={'/register'}>Register</Link></p>
        </div>
    );
}