import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { LoginAPI, GoogleSignInAPI, RegisterAPI } from "../api/AuthAPI";
import { getSingleUser, loginUserData } from "../api/FirestoreAPI";
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /*const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/auth/signin", { name, password });
      dispatch(loginSuccess(res.data));
      navigate("/")
    } catch (err) {
      dispatch(loginFailure());
    }
  };*/

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await LoginAPI(email, password);
      console.log(res);
      const data = getSingleUser(res, email);
      console.log(data);
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  /*const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res);
            dispatch(loginSuccess(res.data));
            navigate("/");
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };*/

  const signInWithGoogle = async () => {
    try {
      console.log("Hello World");
      const res = await GoogleSignInAPI();
      console.log(res);
      const resData = {
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
        uid: res.user.uid,
      }
      console.log(resData);
      loginUserData(resData);
      dispatch(loginSuccess(resData));
      navigate("/");
      
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  //TODO: REGISTER FUNCTIONALITY
  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await RegisterAPI(email, password);
      res.user.displayName = username;
      const data = loginUserData({
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        password: password,
        photoURL: null,
      });
      console.log(data);
      toast.success("Registration Success!");
      dispatch(loginSuccess(data));
      navigate("/");
      //localStorage.setItem("userEmail", res.email);
    } catch (err) {
      dispatch(loginFailure());
      toast.error("Registration Failed!");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to LamaTube</SubTitle>
        <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button /*onClick={handleLogin}*/><strike>Sign in</strike></Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Signin with Google</Button>
        <Title>or</Title>
        <Input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button /*onClick={handleRegister}*/><strike>Sign up</strike></Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
