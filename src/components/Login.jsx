import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";

import { Videos, ChannelCard } from ".";
import { loginAPI, loginAsyncKey, loginFaceBooKAPI, uploadfile, uploadfileVideo } from "../utils/fetchFromAPI";
import { toast } from "react-toastify";
import ReactFacebookLogin from  'react-facebook-login';


const Login = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const formFile = useRef()
  const formFileVideo = useRef()

  const handleUpload = () => {
    
    const file = formFile.current.files[0]
    const formData = new FormData()
    formData.append('hinhanh', file);

 
    uploadfile(formData)
      .then((result) => {
       console.log("result", result)
      })
      .catch((error) => {
       //  toast.error(message);
      });
   } 

   const handleUploadVideo = () => {
    
    const file = formFileVideo.current.files[0]
    console.log("a", file)

    const formData = new FormData()
    formData.append('video', file);

 
    uploadfileVideo(formData)
      .then((result) => {
       console.log("result", result)
      })
      .catch((error) => {
       //  toast.error(message);
      });
   } 

  useEffect(() => {

  }, []);

  return <div className="p-5 " style={{ minHeight: "100vh" }}>
    <div className=" d-flex justify-content-center">
      <form className="row g-3 text-white">
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" />
        </div>

        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Password</label>
          <input className="form-control" id="pass" />
        </div>

        <div className="col-md-2">
          <label htmlFor="inputEmail4" className="form-label">Code</label>
          <input className="form-control" id="code" />
        </div>

        <div className="col-12">
          <button type="button" className="btn btn-primary"
          onClick={() => {
            let email= document.getElementById("email").value;
            let pass_word=document.getElementById("pass").value;
            let code = document.getElementById("code").value;
            console.log(email,pass_word,code);
            loginAsyncKey({
              email,
              pass_word,
              code
            })
            .then((result) => {
              // result gồm message và data (access token)
              //tạo pop up thanh báo thành công
              toast.success(result.message);
              // lưu access token trong local storage của browser
              localStorage.setItem("LOGIN_USER",result.data)
              //chuyển hướng sang trang chủ khi thành công
              navigate("/");
            })
            .catch((error) => {
              toast.error(error.response.data.message);
            })
          }
          }
          >Login</button>
          <Link
            className="text-primary"
            to="/forgot-pass"
          >
            Forgot password
          </Link>
          <ReactFacebookLogin
            appId="3771455953110034"
            fields="name,email,picture"
            callback={(res) => {
              let { id, email, name } = res;
              loginFaceBooKAPI({ id, email, name })
                .then((result) => {
                  toast.success(result.message);
                  localStorage.setItem("LOGIN_USER", result.data);
                  navigate("/");
                })
                .catch((error) => {
                  console.log(error);
                  toast.error(error.message);
                });
            }}
            containerStyle={{
              marginLeft: '15px', // Thêm khoảng cách bên trái
            }}
          />
        </div>

        
      </form>


      <form>
      <input className="form-control" type="file" id="formFile" ref={formFile} />
      <button type="button" className="btn btn-primary" onClick={() => handleUpload()} >Update</button>
      </form>

      
      <form>
      <input className="form-control" type="file" id="formFile" ref={formFileVideo} />
      <button type="button" className="btn btn-primary" onClick={() => handleUploadVideo()} >Update Video</button>
      </form>

    </div>
  </div>
};

export default Login;
