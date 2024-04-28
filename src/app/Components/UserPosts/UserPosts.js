import { URL } from '../../settings';
import './UserPosts.css';
import { useQuery } from 'react-query';
import Post from '../Post/Post';
import DefLoader from '../Loaders/DefLoader/DefLoader';

export default function UserPosts(props){

    const {data, isLoading, isError, error } = useQuery(['getUserPosts'], ()=>fetch(`${URL}/users/posts?id=${props.id}`, {method: 'GET'})
    .then(response=>response.json()))

    return(
        <div className='user-post-cont'>
            {       
                isLoading ? (
                    <DefLoader/>
                ) : isError ? (
                    <div>Error fetching data: {error.message}</div>
                ) : (data?.map((post)=>{
                    const createdAt = new Date(post.created_at);
                    const formattedDate = createdAt.toLocaleString();
            
                    return (
                        <Post
                            key={post.id}
                            id={post.id}
                            pfp={props.PFP}
                            owner={post.username || props.username}
                            time={formattedDate}
                            contents={post.contents}
                            image={post.image ? `data:image/png;base64,${post.image}` : null}
                            videoPath={post.video_path ? post.video_path : null}
                            liked={post.liked}
                        />);
                }))}
                {data?.length === 0 && <p className='no-posts'>There are no posts</p>}
        </div>
    );
} 