import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from "react-router-dom";

function Post() {
  let navigate = useNavigate();
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  // console.log("authState : " + authState);

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`,
      { headers: { accessToken: localStorage.getItem("accessToken"), } }).then((response) => {
        if (!response.data.error) {
          setComments(response.data);
        }
      });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id
        },
        { headers: { accessToken: localStorage.getItem("accessToken"), } }
      )
      .then((response) => {
        if (!response.data.error) {
          const commentToAdd = { commentBody: newComment, username: response.data.username };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(
        `http://localhost:3001/comments/${id}`,
        { headers: { accessToken: localStorage.getItem("accessToken"), } }
      )
      .then((response) => {
        if (!response.data.error) {
          setComments(comments.filter((val) => {
            return val.id !== id;
          }));
        }
      });
  };

  const deletePost = (id) => {
    axios
      .delete(
        `http://localhost:3001/posts/${id}`,
        { headers: { accessToken: localStorage.getItem("accessToken"), } }
      )
      .then((res) => {
        if (!res.data.error) {
          navigate("/");
        }
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new Title:");
      axios.put("http://localhost:3001/posts/title", { newTitle: newTitle, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken"), } }
      )
        .then((res) => {
          setPostObject({ ...postObject, title: newTitle });
        });

    } else if (option === "body") {
      let newText = prompt("Enter new Text:");
      axios.put("http://localhost:3001/posts/postText", { newText: newText, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken"), } }
      )
        .then((res) => {
          setPostObject({ ...postObject, postText: newText });
        });
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title"
            onClick={() => {
              authState.username === postObject.username && editPost("title")
            }}>{postObject.title} </div>
          <div className="body"
            onClick={() => {
              authState.username === postObject.username && editPost("body")
            }}> {postObject.postText}</div>
          <div className="footer">
            <div className="user">
              {postObject.username}
            </div>
            <div className="actions">
              {authState.username === postObject.username && (
                <button className="btnDelete" onClick={() => { deletePost(postObject.id) }}>X</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="rightSide">
        {
          authState.status && (
            <>
              <div className="addCommentContainer">
                <input
                  type="text"
                  placeholder="Comment..."
                  autoComplete="off"
                  value={newComment}
                  onChange={(event) => {
                    setNewComment(event.target.value);
                  }}
                />
                <button onClick={addComment}> Add Comment</button>
              </div>
              <div className="listOfComments">
                {comments.map((comment, key) => {
                  return (
                    <div key={key} className="comment">
                      {comment.id} -
                      {comment.commentBody} -
                      <b> {comment.username}</b>
                      {comment.username === authState.username &&
                        <button className="btnDelete"
                          onClick={() => { deleteComment(comment.id) }}> X</button>}
                    </div>
                  );
                })}
              </div>
            </>
          )
        }


      </div>
    </div>
  );
}

export default Post;