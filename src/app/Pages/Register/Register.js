import './Register.css';
import RegisterForm from '../../Components/Forms/RegisterForm/RegisterForm';
import { useState } from 'react';
import UserInfoForm from '../../Components/Forms/UserInfoForm/UserInfoForm';

export default function Register(){
    const [nextPage, setNextPage] = useState(false);
    const [data, setData] = useState([]);

    const getData = (data)=>{
        setData(data);
    };

    const getNextPage = (nextPage)=>{
        setNextPage(nextPage);
    }

    return (
        <div className='register-cont'>
            {!nextPage?
            <RegisterForm getData={getData} getNextPage={getNextPage}></RegisterForm>:
            <UserInfoForm data={data} getNextPage={getNextPage}></UserInfoForm>}
        </div>
    );
}