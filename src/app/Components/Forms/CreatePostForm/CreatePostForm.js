import { useEffect, useState } from 'react';
import '../Form.css';
import '../../Post/Post.css'
import ButtonLoader from '../../Loaders/ButtonLoader/ButtonLoader';   
import { URL as url } from '../../../settings';
import { useNavigate } from 'react-router-dom';

export default function CreatePostForm(){
    const [contents, setContents] = useState('');
    const [error, setError] = useState("")
    const [error2, setError2] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [liked, setLike] = useState(false);
    const [image, setImage] = useState();
    const [owner] = useState(localStorage.getItem('username'));
    const [pfp, setPfp] = useState();
    const [filename, setFilename] = useState("");
    const [img, setImg] = useState();
    const [video, setVideo] = useState();
    const nav = useNavigate();

    async function getPFP(){
        try{
            const response = await fetch(`${url}/users/getPFP`,
                {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            if (response.ok){
                const data = await response.json()
                setPfp(data);
            }
            else{
                nav('/')
            }

        }
        catch {
            alert('An error has occured2')
            throw new Error('An error has occured')
        }
    }

    async function sendImage(){
        await setIsLoading(true);
        try{
            const formdata = new FormData();
            formdata.append('img', img);
            const response = await fetch(`${url}/posts/upload`,
            {
                method:'POST',
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formdata
            })
            const data = await JSON.parse(response);
            if (!response.ok){
                setError2(data['detail'])
            }
        } catch{
            setError2('An error has occured')
        } finally {
            setIsLoading(false);
        }
    }

    async function createPost(){
        await setIsLoading(true);
        try{
            let info;
            if (img){
                info = {contents , "img": `/post_images/${filename}`};
            } else{
                info = {"contents": contents};
            }
            const response = await fetch(`${url}/posts/`,{
                method: 'POST',
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(info)
            })
            // const data = await JSON.parse(response);
            if (response.status === 201){
                nav('/');
            } else if (response.status === 401){
                nav('/login');
            } else {
                setError('Something Unexpecteds has Occured')
            }
        } catch {
            setError2('An Error has Occured')
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        getPFP();
    }, [])

    useEffect(()=>{
        if (!contents && !image){
            setShow(false);
        } else {
            setShow(true);
        }
    }, [contents, image])

    const handleContentsChange = (event)=>{
        setContents(event.target.value)
        if (contents !== ""){
            setShow(true)
        }
    }

    const handleMediaChange = (event) => {
        const file = event.target.files[0]; // Access the first selected file
        if (file) {
            setFilename(file.name);
    
            setImg(file);
    
            const extension = file.name.split('.').pop().toLowerCase();
            if (['mp4', 'avi', 'mov'].includes(extension)) {
                setVideo(true);
            } else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
                setVideo(false);
            } else {
                setVideo(null); // Reset video state if the file extension is not recognized
            }
    
            const reader = new FileReader(); // Create a FileReader instance
            reader.onloadend = () => {
                setImage(reader.result); // Set image state to the base64 representation of the selected file
            };
            reader.readAsDataURL(file); // Read the selected file as a data URL
        }
    }

    const deleteImage = ()=>{
        setImage(null)
        setFilename(null);
        setImg(null)
        setVideo(null);
    }

    const handleSubmit = () => {
        if (!contents) {
            setError('This Field is required');
        } else {
            if (img) {
                // If both contents and img are present, send both
                sendImage();
                createPost();
            } else {
                // If only contents is present, create post without image
                createPost();
            }
        }
    };    

    const handleLike = ()=>{
        setLike(!liked)
    }

    return (
        <div className='create-cont'>
            <div className='login-form-cont post-cont'>
                <h1 className='form-title'>Create Your Post</h1>

                <textarea onChange={handleContentsChange} autoComplete='off' autoCorrect='off' required={true} placeholder='Share Your Thoughts...' className='form-input'>
                </textarea>
                <div className='error-cont'>
                    <p className={error === ''?'no-error':'error'}>{error}</p>
                </div>

                <div className='form-label-cont'>
                    <label htmlFor='pfp' className='form-label'>Select Media:</label>
                </div>
                <input type='file' accept='image/* video/*' onChange={handleMediaChange} autoComplete='off' autoCorrect='off' required={true} placeholder='Share Your Thoughts...' className='form-input-form-post'/>
                <div className='error-cont'>
                    <p className={error2 === ''?'no-error':'error'}>{error2}</p>
                </div>

                <button onClick={handleSubmit} disabled={isLoading?true:false} type='submit' className={isLoading? 'loading-button' :'form-button'}>
                    {isLoading?<ButtonLoader></ButtonLoader>:<>Share Your Thoughts!</>}
                </button>
            </div>
            {show &&
                (
                    <div className='post-create-cont'>
                        <div className='post post-create'>
                            <div className='post-owner-info'>
                                <img src={`data:image/png;base64,${pfp}`} alt='profile' className='post-owner-image'></img>
                                <h5 className='owner-user-name'>{owner}</h5>
                            </div>
                            <div className='contents'>
                                <p className='post-txt'>{contents}</p>
                                {image && <div className='post-create-cont-img'>
                                    {video? (<video className='post-img post-create-img' src={image}></video>):
                                    (<img src={image} alt='post' className='post-img post-create-img'></img>)}
                                    <div className='post-create-img-overlay' onClick={deleteImage}></div>
                                    </div>}
                            </div>
                            <div className='post-interactions'>
                                <button id='like-button' onClick={handleLike} className={`interaction-button ${liked ? 'liked-like-icon' : 'like-icon'}`}>
                                    <i id='like-icon' className={`material-symbols-outlined ${liked ? 'liked-like-icon' : 'like-icon'}`}>favorite</i> Love{liked ? 'd' : ''}
                                </button>
                                <button id='comment' className={`interaction-button like-icon`}>
                                    <i id='like-button' className={`material-symbols-outlined like-icon`}>comment</i> Comment
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}