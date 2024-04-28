import './Comment.css';
import { useState } from 'react';
import { URL } from '../../../settings';
import { useNavigate } from 'react-router-dom';
import Like from '../../Like/Like';

export default function Comment(props){
    const [liked, setLiked] = useState(props.liked)
    const nav = useNavigate();

    async function like() {
        try {
            const response = await fetch(`${URL}/comment_like/${props.id}`, { 
                method: 'GET' ,
                headers:{
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.status === 401) {
                nav('/login');
            }
            else if (response.ok){
                setLiked(!liked);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }
    
    const handleLike = () => {
        like();
    };

    const createdAt = new Date(props.time);

    // Format the date as desired (adjust the format as needed)
    const formattedDate = createdAt.toLocaleString();

    return (
        <div className='comment'>
            <div className='post-owner-info comment-owner-info'>
                <img src={props.pfp} alt='profile' className='post-owner-image'></img>
                <h5 className='owner-user-name'>{props.owner}</h5>
                <p className='date-posted'>{formattedDate}</p>
            </div>
            <div className='comment-contents'>
                <p>{props.contents}</p>
            </div>
            <div className='comment-interactions'>
                <button id='like-button' onClick={handleLike} className={`interaction-button like-icon like-comment`}>
                    <Like liked={liked}></Like> Love{liked ? 'd' : ''}
                </button>
            </div>
        </div>
    );
}