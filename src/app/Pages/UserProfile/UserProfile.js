import { useEffect, useRef, useState } from 'react';
import UserProfileInfo from '../../Components/UserProfileInfo/UserProfileInfo';
import './UserProfile.css'
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { URL } from '../../settings';
import UserPosts from '../../Components/UserPosts/UserPosts';
import DefLoader from '../../Components/Loaders/DefLoader/DefLoader';

export default function UserProfile(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const userID = searchParams;
    const userData = useRef();
    const decoded = useRef();
    const [PFP, setPFP] = useState();
    const nav = useNavigate();

    async function getPFP(token){
        try{
            const response = await fetch(`${URL}/users/getPFP`,
                {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            )

            if (response.ok){
                const data = await response.json()
                setPFP(data);
            }
            else{
                nav('/')
            }

        }
        catch {
            alert('An error has occured')
            throw new Error('An error has occured')
        }
    }

    async function getUserPFP(id){
        await setLoading(true);
        try{
            const response = await fetch(`${URL}/users/getUserPFP?${id}`,
                {
                    method: 'POST',
                }
            )

            if (response.ok){
                const data = await response.json()
                userData.current = data;
                setPFP(data.profile_picture);
            }
            else{
                nav('/login')
            }

        }
        catch {
            alert('An error has occured')
            throw new Error('An error has occured')
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (userID !== undefined) {
            getUserPFP(userID);
        } else{
            getPFP(token);
            decoded.current = jwtDecode(token);
        }
    }, [userID]);

    return (
        <div className='user-profile-page'>
            {loading? <DefLoader/> :
            <UserProfileInfo PFP={`data:image/png;base64,${PFP}`} time={userData?.current? userData.current?.created_at :decoded.current?.created_at} username={userData?.current? userData.current?.username :decoded.current?.username} />}
            {(userData.current?.id || decoded.current?.id) && <UserPosts username={userData?.current? userData.current?.username :decoded.current?.username} id={userData?.current? userData.current?.id :decoded.current.id} PFP={`data:image/png;base64,${PFP}`} />}
        </div>
    );
}