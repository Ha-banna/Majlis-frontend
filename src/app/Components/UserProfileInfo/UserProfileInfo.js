import './UserProfileInfo.css'

export default function UserProfileInfo(props){
    const postTime = new Date(props.time);
    return(
        <div className='user-profile-info'>
            <img src={props.PFP} alt={`${props.username}'s profile pic`} className='user-profile-image'></img>
            <div className='user-info'>
                <h1>{props.username}</h1>
                <h3>Member Since {postTime.toLocaleDateString()}</h3>
            </div>
        </div>
    );
}