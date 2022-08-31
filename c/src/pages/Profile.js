import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    let navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    let { id } = useParams();
    const [username, setUsername] = useState('');
    const [listOfPosts, setListOfPosts] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/userById/${id}`)
            .then((res) => {
                setListOfPosts(res.data);
            })
        axios.get(`http://localhost:3001/users/profile/${id}`)
            .then((res) => {
                setUsername(res.data.username);
            })
    }, []);

    return (
        <div>
            <div>
                <h2>Profile : {username}
                    {authState.username === username && (
                        <button onClick={()=>{navigate("/editProfile");}}>Edit Profile</button>
                    )}</h2>
            </div>
            <div className="posts" >
                {listOfPosts.map((value, key) => {
                    return (
                        <div className='post' key={value.id}>
                            <div className='title'>{value.title}</div>
                            <div className='body'
                                onClick={() => {
                                    navigate(`/post/${value.id}`)
                                }}>{value.postText}</div>
                            <div className='footer'>
                                {value.username}
                            </div>
                        </div>)
                })}
            </div>
        </div>
    );
}
export default Profile;
