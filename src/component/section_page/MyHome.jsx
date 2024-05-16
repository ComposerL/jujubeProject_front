import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/myHome.css';
import MyProfile from './myprofile';
import { getCookie, removeCookie } from '../../util/cookie';
import { session_check } from '../../util/session_check';

axios.defaults.baseURL = process.env.REACT_APP_HOST;
axios.defaults.withCredentials = true;

const MyHome = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [storyFlag , setStoryFlag] = useState(false);

    useEffect(() => {
        console.log("MyHome useEffect()");
        
        let session  = session_check();
        if(session !== null){
            console.log('[home] session_check enter!!');
            axios_get_member();
        }else{
            console.log('[home] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
            });
        }
        
    },[]);

    
    const axios_get_member = () => {
        console.log("axios_get_member()");
        axios.get(`${process.env.REACT_APP_HOST}/member/get_member`, {
            headers: {
                'Authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(response => {
            console.log('AXIOS GET MEMBER COMMUNICATION SUCCESS');
            console.log(response.data);
            if(response.data === -1){
                console.log("Home server session out!!");
                sessionStorage.removeItem('sessionID');
                removeCookie('accessToken');
                dispatch({
                    type:'session_out',
                });
            }else{

                if(response.data === null){
                    console.log("undefined member");
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));
                    alert("로그인한 멤머 정보가 없습니다. 다시 시도해주세요.")
                }else{
                    console.log("member_id: " + response.data.member.M_ID);
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));
                    sessionStorage.setItem('member_info', JSON.stringify(response.data.member));

                    dispatch({
                        type:'session_enter',
                        loginedMember: response.data.member,
                    });

                    axios_get_profile(response.data.member.M_ID);
                    axios_list_friend(response.data.member.M_ID);
                    axios_get_friend(response.data.member.M_ID);

                }

            }
        })
        .catch(error => {
            console.log('AXIOS GET MEMBER COMMUNICATION ERROR',error);
            
        })
        .finally(() => {
            console.log('AXIOS GET MEMBER COMMUNICATION COMPLETE');
        });
    }
    
    const axios_get_profile = (m_id) => {
        console.log('axios_get_profile()');
        axios({
            url: `${process.env.REACT_APP_HOST}/story/story/get_my_storys`,
            method: 'get',
            params: {
                'm_id': m_id,
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(response => {
            console.log('AXIOS GET MY STORY COMMUNICATION SUCCESS');
            console.log(response.data);
            if (response.data === -1) {
                console.log("Home session out!!");
                sessionStorage.removeItem('sessionID');
                removeCookie('accessToken');
                dispatch({
                    type: 'session_out',
                });
                navigate('/');
            } else {
                if (response.data === null) {
                    console.log("undefined member");
                    
                    alert("스토리를 불러올수 없습니다. 다시 시도해 주세요.");
                   
                    navigate('/');
                } else {
                    console.log(response.data);
                    dispatch({
                        type: 'set_my_stories',
                        story: response.data,
                  
                    });
                    
                }
            }
            
        })
        .catch(error => {
            console.log('AXIOS GET MY STORY COMMUNICATION ERROR', error);
        })
        .finally(() => {
            console.log('AXIOS GET MY STORY COMMUNICATION COMPLETE');
            sessionStorage.removeItem('sessionID');
            sessionStorage.setItem('sessionID',getCookie('accessToken'));
            removeCookie('accessToken');
        });
    }

    const axios_list_friend = (m_id) => {
        console.log('axios_get_friend()');
        axios({
            url: `${process.env.REACT_APP_HOST}/member/get_friend_count`,
            method: 'get',
            params: {
                'id': m_id
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(response => {
                console.log('AXIOS GET MY FRIEND COMMUNICATION SUCCESS');
                console.log(response.data);
                if (response.data === -1) {
                    console.log("Home session out!!");
                    sessionStorage.removeItem('sessionID');
                    removeCookie('accessToken');
                    dispatch({
                        type: 'session_out',
                    });
                    navigate('/');
                } else {
                    if (response.data === null) {
                        console.log("undefined member");
                        
                        alert('친구목록을 불러오지 못했습니다. 다시 시도해주세요.');
                    } else {
                       
                        dispatch({
                            type: 'set_my_friend',
                            friend: response.data,
                        });
                        
                    }
                }
                
            })
            .catch(error => {
                console.log('AXIOS GET MY STORY COMMUNICATION ERROR', error);
            })
            .finally(() => {
                console.log('AXIOS GET MY STORY COMMUNICATION COMPLETE');
                sessionStorage.removeItem('sessionID');//
                sessionStorage.setItem('sessionID',getCookie('accessToken'));//
                removeCookie('accessToken');//
            });
        }

        const axios_get_friend = (m_id) => {
            console.log('axios_get_friend()');
    
            axios({
                url: `${process.env.REACT_APP_HOST}/member/get_friend_status`,
                method: 'post',
                data: {
                    f_id: m_id,
                },
                headers: {
                    'authorization': sessionStorage.getItem('sessionID'),      
                }, 
            })
            .then(response => {
                    console.log('AXIOS GET MY friend COMMUNICATION SUCCESS');
                    console.log(response.data);
                    if (response.data === -1) {
                        console.log("Home session out!!");
                        sessionStorage.removeItem('sessionID');
                        dispatch({
                            type: 'session_out',
                        });
                        navigate('/');
                    } else {
                        if (response.data === null) {
                            console.log("undefined member");
                            alert('친구상태를 불러오지 못했습니다. 다시 시도해주세요.');
                        } else {
                            dispatch({
                                type:'set_my_button',
                                button: 0
                            })
                            
                        }
                    }
                
                })
                .catch(error => {
                    console.log('AXIOS GET MY STORY COMMUNICATION ERROR', error);
                })
                .finally(() => {
                    console.log('AXIOS GET MY STORY COMMUNICATION COMPLETE');
                    sessionStorage.removeItem('sessionID');//
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));//
                    removeCookie('accessToken');//
                });
            }
    

    return (
        <div>
            <MyProfile setStoryFlag={setStoryFlag} />
        </div>
        
    )
}

export default MyHome;
