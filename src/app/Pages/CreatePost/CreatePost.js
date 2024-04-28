import CreatePostForm from '../../Components/Forms/CreatePostForm/CreatePostForm';
import './CreatePost.css';

function CreatePost(){
    return (
        <div className='create-post-cont'>
            <CreatePostForm></CreatePostForm>
        </div>
    );
}

export default CreatePost;