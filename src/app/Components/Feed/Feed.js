import './Feed.css';
import Post from '../Post/Post';
import { useEffect, useRef, useState } from 'react';
import { URL } from '../../settings';
import DefLoader from '../Loaders/DefLoader/DefLoader';
import { jwtDecode } from 'jwt-decode';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';

export default function Feed() {
    const token = useRef(localStorage.getItem('token'))
    const [queryEnabled, setQueryEnabled] = useState(true);
    const {ref , inView} = useInView();

    function getID() {
        try {
            const tokenValue = localStorage.getItem('token');
            const decodedToken = jwtDecode(tokenValue);
            const userId = decodedToken.id;
            return userId || -1; // Return -1 if userId is falsy
        } catch (error) {
            return -1; // Return -1 if an error occurs
        }
    }

    const fetchPosts = (page = 0, pageSize = 10) => {
        return fetch(`${URL}/posts/?id=${getID()}&page=${page}&pageSize=${pageSize}`, { method: 'GET' }).then(
        response=>response.json());
    };

    const { data, error, status, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
        ['getPosts', token, URL],
        ({ pageParam = 0 }) => fetchPosts(pageParam),
        {
            getNextPageParam: (lastPage) => lastPage.next_page || undefined,
            enabled: queryEnabled,
            refetchOnMount: false, 
            refetchOnWindowFocus: false,
            onSuccess: () => {
                setQueryEnabled(false);
            }
        }
    );

    useEffect(()=>{
        if (inView){
            fetchNextPage();
        }
    }, [inView, fetchNextPage])

    return (
        <>
        <div className='feed-title-cont'>
            <h1 className='feed-title'>Your Feed</h1>
        </div>
        <div className='post-feed'>
        {status === 'loading' ? (
            <DefLoader />
        ) : status === 'error' ? (
            <p className='no-posts'>An Error Has Occurred: {error.message}</p>
        ) : (
            <>
                {data.pages && (
                    data.pages.map((page, index)=>{
                        return (<div key={index} className='page'>{
                            page.posts.map((post) => {
                                // Parse the received date string to create a Date object
                                const createdAt = new Date(post.created_at);
                                // Format the date as desired (adjust the format as needed)
                                const formattedDate = createdAt.toLocaleString();
                        
                                return (
                                    <Post
                                        key={post.id}
                                        id={post.id}
                                        pfp={`data:image/png;base64,${post.profile_picture}`}
                                        owner={post.username}
                                        time={formattedDate}
                                        contents={post.contents}
                                        image={post.image ? `data:image/png;base64,${post.image}` : null}
                                        videoPath={post.video_path ? post.video_path : null}
                                        liked={post.liked}
                                        userID={post.user_id}
                                    />
                                );
                            })
                        }</div>)
                }))}  
                {data.pages.length === 0 || data.pages.every(page => page.posts.length === 0) ? (<p className='no-posts'>Be the first to Post! =D</p>): null}
            </>
        )}
                <div className='pagination-trigger' ref={ref}>{isFetchingNextPage && <DefLoader/>}</div>
        </div>
    </>
    );
}
