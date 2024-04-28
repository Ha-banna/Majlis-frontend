import '../Form.css'
import logo from '../../../assets/Majlis-blue-nobg.png'
import { useEffect, useRef, useState } from 'react';
import ButtonLoader from '../../Loaders/ButtonLoader/ButtonLoader';
import { validateEmail, checkPass, validatePass } from '../../../utils/utils';
import { Link } from 'react-router-dom';

export default function RegisterForm (props){
    const email = useRef();
    const pass = useRef();
    const pass2 = useRef();
    const [isLoading, setLoading] = useState(false);
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");
    const [error3, setError3] = useState("");

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          handleSubmit()
        }
      }

    function handleSubmit(){
        setLoading(true);
        setError1('');
        setError2('');
        setError3('');
        let validEmail = validateEmail(email.current.value);
        let validPass = checkPass(pass.current.value);
        let validPass2 = checkPass(pass2.current.value);
        let correctpass = validatePass(pass.current.value);

        if (pass.current.value !== pass2.current.value){
            setError3('Passwords do not match');
        }
        if (!validEmail){
            setError1('Please Enter a Valid Email');
        }
        if (!validPass){
            setError2('Please Enter a Password');
        }
        if (!validPass2){
            setError3('Please Enter a Password');
        }
        if (!correctpass){
            setError2('Password must be at least one lowercase letter, one uppercase letter, one digit, and one special character, with a length between 8 and 32 characters');
        }
        
        if (validEmail && validPass && validPass2 && pass.current.value === pass2.current.value && correctpass){
            props.getData([email.current.value, pass.current.value, pass2.current.value])
            props.getNextPage(true);
        }
        setLoading(false);
    }

    useEffect(()=>{
        email.current.focus();
    },[])

    return (
        <div className='login-form-cont' onKeyPress={handleKeyPress}>
            <img src={logo} alt={'logo'} className='form-logo'></img>            
            <h1 className='form-title'>Register</h1>
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

            <input type='password' ref={pass2} autoComplete='off' autoCorrect='off' required={true} placeholder='Password (Again)' className='form-input'/>
            <div className='error-cont'>
                <p className={error3 === ''?'no-error':'error'}>{error3}</p>
            </div>

            <button onClick={handleSubmit} onKeyPress={handleKeyPress} disabled={isLoading?true:false} type='submit' className={isLoading? 'loading-button' :'form-button'}>
                {isLoading?<ButtonLoader></ButtonLoader>:<>Continue</>}
            </button>
            <p className='account-txt'>Already have an account? <Link className='redirect-txt' to={'/login'}>Log-in</Link></p>
        </div>
    );
}