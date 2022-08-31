import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { AuthContext } from "../helpers/AuthContext";


function Home() {
    let navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        if (!authState.status) {
            navigate("/login");
        } else {
            axios.get("http://localhost:3001/posts",
                { headers: { accessToken: localStorage.getItem("accessToken"), } })
                .then((res) => {
                    setListOfPosts(res.data.listOfPosts);
                    setLikedPosts(res.data.likedPosts.map((like) => {
                        return like.PostId;
                    }));
                });
        }
    }, []);

    const likeAPost = (postId) => {
        axios.post(
            "http://localhost:3001/likes",
            { PostId: postId },
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then((res) => {
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) {
                    if (res.data.liked) {
                        return { ...post, Likes: [...post.Likes, 0] }
                    } else {
                        const arrayLikes = post.Likes;
                        arrayLikes.pop();
                        return { ...post, Likes: arrayLikes }
                    }
                } else {
                    return post;
                }
            }));

            if (likedPosts.includes(postId)) {
                setLikedPosts(likedPosts.filter((id) => {
                    return id !== postId;
                }));
            } else {
                setLikedPosts([...likedPosts, postId]);
            }
        });
    };

    return (
        <div className="App">
            {listOfPosts.slice(0).reverse().map((value, key) => {
                return (
                    <div className='post' key={value.id}>
                        <div className='title'>{value.title}</div>
                        <div className='body'
                            onClick={() => {
                                navigate(`/post/${value.id}`)
                            }}>{value.postText}</div>
                        <div className='footer'>
                            <Link to={`/profile/${value.UserId}`}> {value.username}</Link>
                            <AiFillHeart
                                onClick={() => { likeAPost(value.id); }}
                                className={likedPosts.includes(value.id)
                                    ? "like" : "unlike"} />
                            <label>{value.Likes.length}</label>
                        </div>
                    </div>)
            })}
        </div>
    );

}

export default Home;
