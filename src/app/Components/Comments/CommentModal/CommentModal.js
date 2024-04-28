import { useEffect, useState } from 'react';
import './CommentModal.css';
import Comment from '../Comment/Comment';
import DefLoader from '../../Loaders/DefLoader/DefLoader';
import { URL } from '../../../settings';
import { useNavigate } from 'react-router-dom';

export default function CommentModal(props) {
    const [open, setOpen] = useState(props.open);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [error, setError] = useState([false, ""]);
    const nav = useNavigate();

    async function createComment(){
        try{
            const response = await fetch(`${URL}/comment/`, {
                method:"POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"contents":comment, "post_id": props.post_id})
            })

            if (response.status === 401){
                nav('/login')
            }
        }
        catch{
            throw new Error('Error')
        }
    }

    useEffect(() => {
        setOpen(props.open);
        setError([false, ""])
    }, [props.open]);

    useEffect(() => {
      if (Array.isArray(props.comments.comments)) {
          setComments(props.comments.comments);
          setLikes(props.comments.likes)
      } else {
          setComments([]);
          setLikes([]);
      }
  }, [props.comments]);

    const handleClose = () => {
        setOpen(false);
        setComment('');
        setError([false, ""])
        if (props.onClose) {
            props.onClose(false);
        }
    };

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          handleNewComment()
        }
      }
      

    const handleChange = event => {
        setComment(event.target.value);
        setError([false, ""]);
    };

    function handleNewComment(){
        if (comment !== ""){
            createComment();
            setComment('');
        }
        else{
            setError([true, "Please enter a valid comment"])
        }
    }
    
    return (
        <>
            <div onClick={handleClose} className={open ? 'comment-modal-overlay' : 'comment-dialog-closed'}></div>
            <div className={open ? 'comment-dialog-open' : 'comment-dialog-closed'}>
                <div className='comment-modal-close-cont'>
                    <h3>Comments</h3>
                    <i onClick={handleClose} className="comment-modal-close-button material-symbols-outlined">close</i>
                </div>
                {props.loading?
                    <div className='comments-cont'>
                        <DefLoader></DefLoader>
                    </div>
                    :
                    <div className='comments-cont'>
                        {comments.length !== 0 ? comments.map((comment) => {
                            const liked = likes.includes(comment.id);
                        return(
                            <Comment key={comment.id} pfp={`data:image/png;base64,${comment.profile_picture}`} id={comment.id} owner={comment.username} contents={comment.contents} time={comment.created_at} liked={liked}/>
                        )}):
                        (<p className='no-comments'>There are no comments yet</p>)}
                    </div>
                }
                <div className={error[0]?'modal-bottom':'modal-bottom-ne'}>
                    <p className={error[0]?'modal-error':'no-error'}>{error[1]}</p>
                    <div className={error[0]?'new-comment-input-cont':'new-comment-input-cont-ne'}>
                        <input className='new-comment-input' onKeyPress={handleKeyPress} onChange={handleChange} value={comment} autoFocus type='text' placeholder='What are you thinking....' autoComplete='off' />
                        <div onClick={handleNewComment} className='new-comment-send-button'><i className="material-symbols-outlined new-comment-send-icon">prompt_suggestion</i></div>
                    </div>
                </div>
            </div>
        </>
    );
}
