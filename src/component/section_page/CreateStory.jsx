import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/story/create_story.css';
import ImageSwiper from './ImageSwiper';

axios.defaults.withCredentials = true;

const CreateStory = () => {

    const dispatch = useDispatch();
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadImage, setUploadImage] = useState([]);
    const loginedMember = useSelector(store => store.loginedMember);
    const [isPublic, setIsPublic] = useState('0');
    const [sTxt, setSTxt] = useState('')
    
    useEffect(() => {
        console.log('CreateStory useEffect()');
        axios_get_member()

    }, [])

    const navigate = useNavigate();

    const onImageHandler = (e) => {

        const imageArr = e.target.files;
        let imageURLs = [];
        setUploadImage(imageArr);

        for(let i = 0; i < imageArr.length; i++) {
            const curImgURL = URL.createObjectURL(imageArr[i]);
            imageURLs.push(curImgURL);
            console.log('imageURLs---', imageURLs);
        }

        setImagePreviews(imageURLs);

    }

    const writeStoryClickBtn = () => {
        console.log('writeStoryClickBtn()')

        if (uploadImage.length <= 0) {
            alert('스토리에 업로드 할 이미지가 없습니다. 이미지를 선택하세요.')
        } else if (sTxt === '') {
            alert('스토리에 업로드 할 내용을 작성해주세요..')
            $('#s_txt').focus();
        } else {
            let result = window.confirm('스토리를 작성하시겠습니까?');
            if (result) {
                axios_write_story();
            }
        }
    }

    const axios_write_story = () => {
        console.log('axios_write_story()');

        let formData = new FormData();
        formData.append("s_txt", sTxt);
        formData.append("s_is_public", isPublic);
        formData.append("m_id", loginedMember);
        for(let i = 0; i < uploadImage.length; i++) {
            
            formData.append("files", uploadImage[i]);
        }

        console.log('formData---', ...formData);

        axios({
            url: `${process.env.REACT_APP_HOST}/story/story/write_confirm`,
            method: 'post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log('axios_write_story communication success', response.data);

            if(response.data === null) {
                return alert('서버 통신 중 오류가 발생했습니다. 다시 시도해주세요.')
            }

            if (response.data > 0) {
                alert('스토리 작성이 완료되었습니다.');
                navigate('/member/my_home');
            }

        })
        .catch((error) => {
            console.log('axios_write_story communication error', error);

        })

    }

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
            }else{
    
                if(respones.data === null){
                    console.log("undefined member");
                    sessionStorage.removeItem('sessionID');
                    dispatch({
                        type:'session_out',
                    });
                }else{
                    console.log("member_id: " + respones.data.member.M_ID);
                    dispatch({
                        type:'session_enter',
                        loginedMember: respones.data.member.M_ID,
                    });
                    
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

    /*
    // 1개 파일 resizing
    const onImageHandler = async (e) => {
        console.log('onImageHandler()', e.target.files[0]);

        const file = await e.target.files[0];
        console.log("imgae incoding before : ", file);

        // 허용한 이미지 형식 정의
        const supepertedFormats = ["image/jpeg", "image/png", "image/svg+xml"];

        if (!e.target.files[0]) {
            return;
        }

        if (!supepertedFormats.includes(file.type)) {
            alert("지원되지 않는 이미지 형식입니다. JPEG, PNG형식의 이미지를 업로드해주세요.");
            return;
        }

        try {

            const compressedFile = await resizeFile(e.target.files[0]);
            console.log('image incoding after : ', compressedFile);

            setImagePreview(String(compressedFile));
            setUploadImage(String(compressedFile));


        } catch (error) {
            console.log('file resizing failed. ', error);
        }

    }

    const resizeFile = (file) => 
        new Promise((resolve) => {      //비동기 작업을 위해서 "Promise"를 통한 비동기 작업 정의 
            Resizer.imageFileResizer(   //Resizer의 "imageFileResize"메서드를 통해서 이미지 리사이징 및 인코딩 옵션 정의
                file,
                400,    // 이미지 너비
                400,    // 이미지 높이
                "SVG",  // 파일 형식
                100,    // 이미지 퀄리티
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64",   // output format. base64 or blob
            )
        })
    */

    /*
    // multiple resizing
    const onImageHandler = async (e) => {

        const files = e.target.files;
        console.log('files---', files);
        const supportedFormats = ["image/jpeg", "image/png", "image/svg+xml"];
        const compressedFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!supportedFormats.includes(file.type)) {
                alert(`${file.name}은 지원되지 않는 이미지 형식입니다. JPEG, PNG, SVG형식의 이미지를 업로드해주세요.`);
                continue;
            }

            try {

                const compressedFile = await resizeFile(file);
                compressedFiles.push(compressedFile);

            } catch (error) {
                console.log("file resizing failed:", error);
            }
        }
        setUploadImage(compressedFiles);
        setImagePreviews(compressedFiles);
        console.log('compressedFiles---', compressedFiles);

    }

    const resizeFile = (file) =>
        new Promise((resolve) => {          //비동기 작업을 위해서 "Promise"를 통한 비동기 작업 정의 
            Resizer.imageFileResizer(       //Resizer의 "imageFileResize"메서드를 통해서 이미지 리사이징 및 인코딩
                file,
                file.width,    // 이미지 너비
                file.height,    // 이미지 높이
                "jpeg",  // 파일 형식
                80,    // 이미지 퀄리티
                0,
                (uri) => {
                resolve(uri); 
                },
                "base64"        // output format. base64 or blob
            );
        }
    );
    */

    return (
        <div id='create_story_wrap'>

            <div className='story_img_wrap'>
                <div className='preview_img_wrap'>

                    {
                        imagePreviews.length > 0
                        ?
                        <ImageSwiper imagePreviews={imagePreviews} />
                        :
                        <div className='input_file_img'>
                            <label for="file">사진첨부</label> 
                            <input 
                                type="file"
                                id="file"
                                className="input_image"
                                accept="image/*"    // 이미지 파일만 업로드 가능.
                                multiple
                                onChange={e => onImageHandler(e)}
                            />
                        </div>
                    }

                </div>
            </div>
            
            <div className="select_is_public">
                <div className='public_p'>
                    <p>공개여부 &nbsp; </p>
                </div>
                <div className="select_public">
                    <input type="radio" name="s_is_public" value="0" checked={isPublic === '0'} onChange={(e) =>setIsPublic(e.target.value)}/> 전체공개
                </div>
                <div className="select_friend_public">
                    <input type="radio" name="s_is_public" value="1" checked={isPublic === '1'} onChange={(e) =>setIsPublic(e.target.value)}/> 일촌공개
                </div>
                <div className="select_private">
                    <input type="radio" name="s_is_public" value="-1" checked={isPublic === '-1'} onChange={(e) =>setIsPublic(e.target.value)}/> 비공개
                </div>
            </div>

            <div className='write_s_txt'>
                <div className='input_s_txt'>
                    <textarea name="s_txt" value={sTxt} id="s_txt" cols="50" rows="8" onChange={(e) => setSTxt(e.target.value)} placeholder='스토리 내용 작성' />
                </div>
            </div>

            <div className='story_btns'>
                <button onClick={writeStoryClickBtn} >등록</button>
            </div>

        </div>
    )
}

export default CreateStory;