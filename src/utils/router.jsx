import React, { useEffect } from "react";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Send from "../pages/Send";
import cookie from "react-cookies";
import Detail from "../pages/Detail";
import Wishes from "../pages/Wishes";
import Header from "../components/Header";
import MyWish from "../pages/MyWish";
import { Navigate, Route, Routes } from "react-router-dom";
function Router(props) {
  // 保存WHUT登录后返回的token
  useEffect(() => {
    let token = cookie.load("jwt_token");
    if (token) {
      localStorage.setItem("token", token);
      // props.history.push("/");
    }
    if (!localStorage.getItem("token")) {
      // props.history.push("/login");
    }
  }, [props.history]);

  return (
    <>
      {/* todo fixthis */}
      {/* {props.location.pathname.match(/login/) ? null : <Header></Header>} */}
      <div className="content">
        <Routes>
          <Route path="login" element={<Login />}></Route>
          <Route path="home" element={<Home />}></Route>
          <Route path="send" element={<Send />}></Route>
          <Route path="detail" element={<Detail />}></Route>
          <Route path="wish/:tag" element={<Wishes />}></Route>
          <Route path="mywish" element={<MyWish />}></Route>
          <Route
            path="*"
            to={localStorage.getItem("token") === null ? "/login" : "/home"}
          />
        </Routes>
      </div>
    </>
  );
}

export default Router;
