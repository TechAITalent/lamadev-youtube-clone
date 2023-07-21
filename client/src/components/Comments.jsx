import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";
import { getVideoComments, uploadVideoComment } from "../api/FirestoreAPI";
import { serverTimestamp } from "firebase/firestore";
import TimeAgo from "timeago-react";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  //TODO: ADD NEW COMMENT FUNCTIONALITY
  const addComment = async (e) => {
    if (e.key === "Enter" && newComment !== "") {
      try {
        let currentTime = Date().toLocaleString();
        const res = {
          comment: newComment,
          photoUrl: currentUser.photoURL,
          postedAt: currentTime,
          username: currentUser.displayName,
          uid: currentUser.uid,
          vid: videoId,
        };
        uploadVideoComment(res);
      } catch (err) {}
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        //const res = await axios.get(`/comments/${videoId}`);
        //setComments(res.data);
        getVideoComments(setComments, videoId);
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.photoURL} />
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={addComment}
        />
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment.comment} comment={comment}/>
      ))}
    </Container>
  );
};

export default Comments;
