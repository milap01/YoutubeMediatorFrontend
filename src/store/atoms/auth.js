import {atom, useSetRecoilState} from 'recoil';
import Cookies from 'js-cookie'
import { axiosApi } from '../../api/axios';
import {AES,enc} from 'crypto-js';

export const loginAtom = atom({
    key : "loginAtom",
    default : Cookies.get('refresh_token') ? true:false,
})

export const accessToken = atom({
    key : "accessToken",
    default : Cookies.get('access_token')?true:false,
})

export const registerSuccess = atom({
    key : "registerSuccess",
    default : false
})

export const loadingAtom = atom({
    key : 'loadingAtom',
    default : false,
})

export const authLogin = async (email,password) => {
    
    try {
        const response = await axiosApi.post('api/token/',{
            "email":email,
            "password":password
        });
        const data = response.data;
        const refresh_token = AES.encrypt(data.refresh,import.meta.env.VITE_SECRET_PASSWORD).toString()
        Cookies.set('access_token',data.access,{expires: 1});
        Cookies.set('refresh_token',refresh_token,{expires: 60});
        
        return false

    } catch (error) {
       return true
    }

}

