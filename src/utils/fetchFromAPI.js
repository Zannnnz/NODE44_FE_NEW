import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    'token': localStorage.getItem("LOGIN_USER")
  },
};

// Tạo một istance axious
export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`
})
// Thêm  một interceptor để gắn access token vào headers 
axiosInstance.interceptors.request.use(
  (config) => {
    // kiểm tra flag requiredAuth của API
    if (config.requiredAuth){
      // lấy access token từ storage
      const accessToken = localStorage.getItem("LOGIN_USER");
      console.log("accessToken", accessToken)
      if (accessToken){
        config.headers["token"]= `${accessToken}`;
      }
    }
    return config
  },
  (error) => {}
)
const extendToken=async () => {
  const {data} = await axiosInstance.post(`/auth/extend-token`,{},{
    withCredentials:true // cho phép gửi và nhận cookie từ server
  })

  console.log("response data from api extend-token: ",data)
  // lưu access token mới vào localStorge
  localStorage.setItem("LOGIN_USER",data.data);
  return data;
}

// config intercreptor cho res  mỗi khi res API nào đó khi trả về 401
axiosInstance.interceptors.response.use(
  (response) => {return response}, // param function khi response API trả về 2x
  async(error) => {
    const originalRequest = error.config;
    if (error.response.status === 401){
      try {
        const data = await extendToken();
        console.log("data",data);
        // gán lại token mới vào headers
        originalRequest.headers["token"] =data.data;
        // call lại API 1 lần nữa
        return axiosInstance(originalRequest)
      } catch (error) {
        console.log('Extend token failed',error)
      }
    };
    return Promise.reject(error);
  } // param khác trả về 2x
)



export const fetchFromAPI = async (url) => {

  console.log(localStorage.getItem("LOGIN_USER"))

  const { data } = await axiosInstance.get(`${BASE_URL}/${url}`);

  return data;
};

export const getVideo= async (videoid) => {
  const {data} = await axiosInstance.get(`${BASE_URL}/video/get-video/${videoid}`);
  return data;
}


export const getListVideo = async () =>{
  const {data} = await axiosInstance.get(`${BASE_URL}/video/get-list-videos`);
  return data;
}

export const getType = async ()=>{
  const{data}=await axiosInstance.get(`${BASE_URL}/video/get-types`,options);
  return data;
}

export const getListVideoType = async(typeid)=>{
    const {data} = await axiosInstance.get(`${BASE_URL}/video/get-typpes-details/${typeid}`);
    return data;
}

export const registerApi= async(payload)=>{
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/register`,payload);
  return data;
}
export const loginAPI = async (payload) =>{
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/login`,payload,{
    withCredentials:true // cho phép gửi và nhận cookie từ server BE
  });
  return data;
}

export const loginFaceBooKAPI =async(newUser) => {
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/login-face`,newUser);
  return data;
}

export const loginAsyncKey = async (payload) =>{
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/login-async-key`,payload,{
    withCredentials:true // cho phép gửi và nhận cookie từ server BE
  });
  return data;
}

export const forgotPassAPI = async (email)=>{
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/forgot-password`,email);
  return data;
}

export const changePassAPI = async (payload)=>{
  //payload: {email,code,newPass}
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/change-password`,payload);
  return data;
}

export const getUserAPI = async (params) => {
  const{data} = await axiosInstance.get(`${BASE_URL}/users/get-users`);
  return data;
}


export const uploadAPI = async (file) => {
  const{data} = await axiosInstance.post(`${BASE_URL}/users/upload-avatar`,file);
  return data;
}


