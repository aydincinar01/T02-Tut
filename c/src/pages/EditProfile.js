import React, { useState } from "react";
import axios from "axios";

function EditProfile() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const changePassword = () => {
       axios.put("http://localhost:3001/users/edit/",
            { oldPassword: oldPassword, newPassword: newPassword },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then((res) => {
            console.log(" i have response from changePassword ");
            if(res.data.error){
                alert(res.data.error);
            }else{
                alert("Passord Changed !"); 
            }
        })
    }

    return (
        <div>
            <div>
                <h2>Change Your Password </h2>
                    <label htmlFor="oldPassword">Password : </label>
                    <input
                        autoFocus
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        placeholder="enter old password"
                        onChange={(e) => {
                            setOldPassword(e.target.value);
                        }}
                    />
                    <label htmlFor="newPassword">New Password : </label>
                    <input
                        autoFocus
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="new password"
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                        }}
                    />
                    <button type="submit" onClick={changePassword}>Update</button>
            </div>
        </div>
    );
}
export default EditProfile;
