import { useEffect, useRef, useState } from "react"
import { axiosApi } from "../api/axios";
import Cookies from 'js-cookie';


function UploadWidget({ email, full_name, setAvatar }) {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();


    useEffect(() => {

        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dwyrquguw',
            uploadPreset: 'pozbqp1k',
        }, function (error, result) {
            if (error) {
                return;
            }

            if (result.info.url) {
                const setProfile = async () => {

                    try {
                        const cookie = Cookies.get('access_token');
                        const response = await axiosApi.put('api/user-profile/', {
                            "full_name": full_name,
                            "email": email,
                            "avatar": result.info.url.toString()
                        }, {
                            headers: { Authorization: `Bearer ${cookie}` }
                        })

                        setAvatar(result.info.url.toString())



                    } catch (error) {
                        return;

                    }
                }

                setProfile()

            }
        }
        )

    }, [])

    return (
        <div>
            <button onClick={() => widgetRef.current.open()} className="m-2 p-2 border border-solid text-black border-indigo-600 rounded-md hover: bg-indigo-600  font-bold text-sm font-mono" >Change Profile</button>
        </div>
    )
}

export default UploadWidget

