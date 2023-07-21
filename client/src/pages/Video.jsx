import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
//import axios from "axios";
import { dislike, fetchStart, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";
import { dislikeVideo, getComments, getSingleVideo, likeVideo } from "../api/FirestoreAPI";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchStart();
        /*const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );*/
        await getSingleVideo(setVideo, path);

        //setChannel(channelRes.data);
        //await console.log(dispatch(fetchSuccess(video)));
      } catch (err) {}
    };
    fetchData();
  }, [path, dispatch]);

  useEffect(() => {
    try {
      if (!null) {
        console.log(video[0].createdAt);
        video[0].createdAt = format(video[0].createdAt);
        console.log(video[0].createdAt);
        dispatch(fetchSuccess(video[0]));
        const channelRes = currentVideo.uploader;
        setChannel(channelRes);
        console.log(channelRes);
      }
    } catch (err) {}
  }, [video, setVideo]);

  const handleLike = async () => {
    //await axios.put(`/users/like/${currentVideo.id}`);
    likeVideo(path, currentUser.uid);
    //dispatch(like(currentUser.id));
    console.log(currentVideo.likes);
  };
  const handleDislike = async () => {
    //await axios.put(`/users/dislike/${currentVideo.id}`);
    dislikeVideo(path, currentUser.uid);
    //dispatch(dislike(currentUser.id));
    console.log(currentVideo.dislikes);
  };

  const handleSub = async () => {
    /*currentUser.subscribedUsers.includes(channel.id)
      ? await axios.put(`/users/unsub/${channel.id}`)
      : await axios.put(`/users/sub/${channel.id}`);*/
    dispatch(subscription(channel.id));
  };

  const shareVideo = () => {
    navigator.clipboard.writeText(currentVideo?.videoUrl);
    console.log("Video shared" + currentVideo?.videoUrl);
  };

  //TODO: DELETE VIDEO FUNCTIONALITY

  // CurrentVideo Testing
  console.log(currentUser);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo?.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views} views • {currentVideo?.createdAt}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentUser?.likedVideos?.includes(currentVideo?.id) ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOutlinedIcon />
                )
              }{" "}
              {currentVideo?.likes}
            </Button>
            <Button onClick={handleDislike}>
              {
                currentVideo?.dislikes?.toString().includes(currentUser?.id) ? (
                  <ThumbDownIcon />
                ) : (
                  <ThumbDownOffAltOutlinedIcon />
                )
              }{" "}
              {currentVideo?.dislikes}
            </Button>
            <Button onClick={shareVideo}>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Link
              to={`/channel/${channel.uid}`}
              style={{ textDecoration: "none" }}
            >
              <Image src={channel.photoURL} />
            </Link>
            <ChannelDetail>
              <ChannelName>{channel.displayName}</ChannelName>
              <ChannelCounter>
                {channel.subscribers ? channel.subscribers : 0} subscribers
              </ChannelCounter>
              <Description>{currentVideo?.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser.subscribedUsers?.includes(channel.id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?.id} />
      </Content>
      <Recommendation tags={currentVideo?.tags} />
    </Container>
  );
};

export default Video;
