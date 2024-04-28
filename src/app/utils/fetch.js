import { URL } from "../settings";

function sendLoginInfo(userInfo) {
    return fetch(`${URL}/users/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)});
}


export {sendLoginInfo};


// const fetchData = async () => {
//     setLoading(true);
//     try {
//         const token = localStorage.getItem('token');
//         let decoded;

//         // Decode the token only if it exists
//         if (token) {
//             decoded = jwtDecode(token);
//         }

//         let response;

//         // If decoded token exists, fetch posts based on user ID
        

//         if (!response.ok) {
//             throw new Error('Failed to fetch posts');
//         }

//         const data = await response.json();
//         setPosts(data['posts']);
//         setLikes(data['likes']);
//     } catch (error) {
//         console.error('Error fetching posts:', error);
//     } finally {
//         setLoading(false);
//     }