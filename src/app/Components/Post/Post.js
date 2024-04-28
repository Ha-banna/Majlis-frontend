import { useEffect, useRef, useState } from 'react';
import './Post.css';
import CommentModal from '../Comments/CommentModal/CommentModal';
import { URL as url } from '../../settings';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Like from '../Like/Like';
import { useQuery } from 'react-query';

export default function Post(props) {
    const [liked, setLiked] = useState(props.liked);
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const path = useRef(props.videoPath)
    const nav = useNavigate();
    
    const { data } = useQuery(['getVideo', path.current], async () => {
        try {
            const response = await fetch(`${url}/posts/getVideo/?path=${path.current}`, { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to fetch video');
            }
            const blobData = await response.blob();
            return URL.createObjectURL(blobData);
        } catch (error) {
            console.error('Error fetching video:', error);
            return null; // Return null in case of an error
        }
    }, {
        enabled: !!props.videoPath,
    });

    useEffect(()=>{
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]);

    async function fetchComments() {
        setLoading(true)
        try {
            const token = localStorage.getItem('token');
            let decoded = null;
            let response;
            if (token){
                decoded = jwtDecode(token);
                response = await fetch(`${url}/comment/?id=${props.id}&user_id=${decoded.id}`, { method: 'GET' });
            } else {
                response = await fetch(`${url}/comment/?id=${props.id}`, { method: 'GET' });
            }
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data); // assuming data is an array of comments
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
        finally{
            setLoading(false);
        }
    }

    async function like() {
        try {
            const response = await fetch(`${url}/like/${props.id}`, { 
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

    const handleComment = () => {
        setIsOpen(true);
    };

    const toggleOpen = (open) => {
        setIsOpen(open);
    };

    const postTime = new Date(props.time);

    return (
        <>
            <CommentModal open={isOpen} onClose={toggleOpen} post_id={props.id} comments={comments} loading={loading}></CommentModal>
            <div className='post'>
                <div className='post-owner-info'>
                    <Link to={`/user-profile?id=${props.userID}`}><img src={props.pfp} alt='profile' className='post-owner-image'></img></Link>
                    <h5 className='owner-user-name'>{props.owner}</h5>
                    <p className='date-posted'>{postTime.toLocaleDateString()} {postTime.toLocaleTimeString()}</p>
                </div>
                <div className='contents'>
                    <p className='post-txt'>{props.contents}</p>
                    {(props.image || props.videoPath) ? props.videoPath ? (
                        <video controls className='post-img' src={ props.videoPath ? data : null}></video>
                    ) : (
                        <img src={props.image} alt='post' className='post-img' />
                    ):null}
                </div>
                <div className='post-interactions'>
                    <button id='like-button' onClick={handleLike} className={`interaction-button like-icon`}>
                        <Like liked={liked}></Like> Love{liked ? 'd' : ''}
                    </button>
                    <button id='comment' onClick={handleComment} className={`interaction-button like-icon`}>
                        <i id='like-button' className={`material-symbols-outlined like-icon`}>comment</i> Comment
                    </button>
                </div>
            </div>
        </>
    );
}