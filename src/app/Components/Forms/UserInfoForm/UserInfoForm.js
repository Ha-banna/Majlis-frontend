import '../Form.css';
import { useEffect, useRef, useState } from 'react';
import logo from '../../../assets/Majlis-blue-nobg.png'
import ButtonLoader from '../../Loaders/ButtonLoader/ButtonLoader';
import defaultPFP from '../../../assets/default-pfp.png'
import { URL } from '../../../settings';
import { useNavigate } from 'react-router-dom';
import { validateDate } from '../../../utils/utils';

export default function UserInfoForm(props){
    const [error, setError1] = useState("");
    const [error2, setError2] = useState("");
    const [error3, setError3] = useState("");
    const username = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const DOB = useRef();
    const [pfp, setPFP] = useState(null);
    const [PFPName, setPFPName] = useState("");
    const [img, setImg] = useState(null);
    const nav = useNavigate()
    const date = new Date();

    async function fetchData() {
        await setIsLoading(true)
        try{
            const response = await fetch(`${URL}/users/register`,
                {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": props.data[0], 
                        "username": username.current.value, 
                        "password": props.data[1],
                        "password_again" : props.data[2],
                        "pfp": img ? `/images/${PFPName}` : "",
                        "dob": DOB.current.value
                    })
                }
            );
            const data = await response.json();
            if (response.status === 201){
                localStorage.setItem("token", data['token']);
                nav('/')
            }
            else{
                setError3(data['detail'])
            }
        }
        catch (error){
            setError3('An Error has Occured', error)
        }
        finally{
            setIsLoading(false)
        }
    }

    async function uploadImage() {
        await setIsLoading(true);
        try {
            const formdata = new FormData()
            formdata.append('img', img)
            const response = await fetch(`${URL}/users/upload`, {
                method: "POST",
                body: img ? formdata : null
            });
            const data = await response.json()
            if (!response.ok) {
                setError2(data['detail']);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          handleSubmit()
        }
    }

    function handlePFPChange(event){
        const file = event.target.files[0]; // Access the first selected file
        if (file) {
            setImg(file)
            setPFPName(file.name)
            const reader = new FileReader(); // Create a FileReader instance
            reader.onloadend = () => {
                setPFP(reader.result); // Set pfp state to the base64 representation of the selected image
            };
            reader.readAsDataURL(file); // Read the selected file as a data URL
        }    
    }

    const checkDOB = () => {
        if (!DOB.current.value) {
            setError3('Please Enter a Date');
            return false;
        }
    
        const validDOB = validateDate(DOB.current.value);
        if (validDOB) {
            const dobParts = DOB.current.value.split(/[./]/); // Split the date string by . or /
            const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`; // Rearrange parts to YYYY-MM-DD
            DOB.current.value = formattedDOB;

            if (dobParts[2] >= date.getFullYear() - 12) {
                setError3("Too Young to Create Account");
                return false;
            }

            if (dobParts[2] < 1900) {
                setError3("Invalid Date");
                return false;
            }
            return true;
        } else {
            setError3('Please Enter a Valid Date');
            return false;
        }
    };
    

    async function handleSubmit(){
        setError1("");
        setError2("");
        setError3("");

        if (img){
            await uploadImage();
        }
        if (username.current.value === ""){
            setError1("Please Enter a Username")
        }
        if (checkDOB() && username.current.value !== ""){
            await fetchData()
        }
        setIsLoading(false)
    }

    useEffect(()=>{
        username.current.focus();
    });

    return(
        <div className='login-form-cont' onKeyPress={handleKeyPress}>
            <img src={logo} alt={'logo'} className='form-logo'></img>            
            <h1 className='form-title'>Set up your profile!</h1>
            <input type='text' ref={username} autoComplete='off' autoCorrect='off' required={true} placeholder='Username' className='form-input'/>
            <div className='error-cont'>
                <p className={error === ''?'no-error':'error'}>{error}</p>
            </div>
            
            <div className='form-label-cont'>
                <label htmlFor='pfp' className='form-label'>Select Your Profile Picture:</label>
            </div>

            <div className='file-input-cont'>
                <input type='file' onChange={handlePFPChange} id='pfp' accept="image/*"  autoComplete='off' autoCorrect='off' required={true} placeholder='Profile Picture' className='form-file'/>

                <div className='selected-pfp-cont'>
                   <img src={pfp ? pfp : defaultPFP} alt='Selected PFP' className='selected-pfp'></img>
                </div>
            </div>
            <div className='error-cont'>
               <p className={error2 === ''?'no-error':'error'}>{error2}</p>
            </div>

            <input type={'text'} ref={DOB} autoComplete='off' autoCorrect='off' required={true} placeholder='Date of Birth (DD/MM/YYYY)' className='form-input'/>
            <div className='error-cont'>
                <p className={error3 === ''?'no-error':'error'}>{error3}</p>
            </div>

            <button onClick={handleSubmit} onKeyPress={handleKeyPress} disabled={isLoading?true:false} type='submit' className={isLoading? 'loading-button' :'form-button'}>
                {isLoading?<ButtonLoader></ButtonLoader>:<>Get Started!</>}
            </button>
        </div>
    );
}