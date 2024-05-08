import React, { useEffect } from 'react'
import '../../css/myHome.css';
import axios from 'axios';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import MyProfile from './MyProfile';

axios.defaults.withCredentials = true;



const MyHome = () => {

    //hook
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("MyHome useEffect()");
        axios_get_member();
    }, []);

    const axios_get_member = () => {
        console.log("axios_get_member()");
        axios.get(`${process.env.REACT_APP_HOST}/member/get_member`, {
            
        })
       .then(respones => {
            console.log('AXIOS GET MEMBER COMMUNICATION SUCCESS');
            console.log(respones.data);
            if(respones.data === -1){
                console.log("Home session out!!");
                sessionStorage.removeItem('sessionID');
                dispatch({
                    type:'session_out',
                });
                navigate('/');
            }else{
    
                if(respones.data === null){
                    console.log("undefined member");
                    console.log("Home session out!!");
                    sessionStorage.removeItem('sessionID');
                    dispatch({
                        type:'session_out',
                    });
                    navigate('/');
                }else{
                    console.log("member_id: " + respones.data.member.M_ID);
                    dispatch({
                        type:'session_enter',
                        loginedMember: respones.data.member.M_ID,
                    });
                    axios_get_profile();
                }
            
            }
       })
       .catch(error => {
            console.log('AXIOS GET MEMBER COMMUNICATION ERROR');
        
        })
        .finally(() => {
            console.log('AXIOS GET MEMBER COMMUNICATION COMPLETE');
             
        });
    }

    const axios_get_profile = () => {
        console.log('axios_get_profile()');

        axios({
            url: `${process.env.REACT_APP_HOST}/member/get_my_storys`,
            method: 'get',
            params: {
            
            }
        })
        .then(respones => {
            console.log('AXIOS GET MY STORY COMMUNICATION SUCCESS');
            console.log(respones.data);
            if(respones.data === -1){
                console.log("Home session out!!");
                sessionStorage.removeItem('sessionID');
                dispatch({
                    type:'session_out',
                });
                navigate('/');
            }else{
    
                if(respones.data === null){
                    console.log("undefined member");
                    sessionStorage.removeItem('sessionID');
                    dispatch({
                        type:'session_out',
                    });
                    navigate('/');
                }else{
                    console.log("member_id: " + respones.data.member.M_ID);
                    dispatch({
                        type:'',
                        loginedMember: respones.data.member.M_ID,
                    });
                    axios_get_profile();
                }
            
            }
       })
       .catch(error => {
            console.log('AXIOS GET MEMBER COMMUNICATION ERROR');
        
        })
        .finally(() => {
            console.log('AXIOS GET MEMBER COMMUNICATION COMPLETE');
             
        });
    }

  return (
    <div>
        {/* <MyProfile /> */}
    </div>
  )
}

export default MyHome;