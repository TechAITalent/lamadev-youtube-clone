import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { dislike, fetchStart, fetchSuccess, like } from "../redux/videoSlice";
import { getSingleChannel } from "../api/FirestoreAPI";

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;
const ChannelVideoCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;
const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;
const ChannelData = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ChannelMain = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ChannelInfo = styled.div`
  display: flex;
  gap: 50px;
`;
const ChannelTab = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
`;
const Container = styled.div`
  display: flex;
  gap: 24px;
`;
const Content = styled.div`
  flex: 5;
`;
const Image = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;
const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 10px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;
const Url = styled.span`
  font-size: 14px;
  font-weight: 300;
  margin-top: 10px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Channel = () => {
  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});
  const [videos, setVideos] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchStart();
        /*const videoRes = await axios.get(`/videos/find/${path}`);
            const channelRes = await axios.get(
              `/users/find/${videoRes.data.userId}`
            );*/
        await getSingleChannel(setChannel, path);
        //setChannel(channelRes.data);
        //await console.log(dispatch(fetchSuccess(video)));
      } catch (err) {}
    };
    fetchData();
  }, [path, dispatch]);

  // Channel Testing
  console.log(channel);

  return (
    <Container>
      <Content>
        <ChannelMain>
          <ChannelInfo>
            <Image
              src={channel[0]?.photoURL ? channel[0]?.photoURL : "PhotoURL"}
            />
            <ChannelDetail>
              <Title>{channel[0]?.displayName}</Title>
              <ChannelData>
                <Url>{channel[0]?.uid}</Url>
                <ChannelCounter>
                  {channel[0]?.subscribers ? channel[0]?.subscribers : 0}{" "}
                  subscribers
                </ChannelCounter>
                <ChannelVideoCounter>
                  {channel[0]?.videos ? channel[0]?.videos : 0} videos
                </ChannelVideoCounter>
              </ChannelData>
              Channel Description
            </ChannelDetail>
          </ChannelInfo>
        </ChannelMain>
        <ChannelTab>
          <Link to={`/channel/${path}`} style={{color: '#FFF', textDecoration: 'none' }}>Home</Link>
          <Link to={`/channel/${path}/videos`} style={{color: '#FFF', textDecoration: 'none' }}>Videos</Link>
          <Link to={`/channel/${path}/playlists`} style={{color: '#FFF', textDecoration: 'none' }}>Playlists</Link>
          <Link to={`/channel/${path}/about`} style={{color: '#FFF', textDecoration: 'none' }}>About</Link>
        </ChannelTab>
      </Content>
    </Container>
  );
};

export default Channel;
