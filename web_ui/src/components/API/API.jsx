import React from 'react';

function check_jwt_exp_time(jwt) {
    let JWT_payload = b64DecodeUnicode(jwt.split(".")[1]);
    let jwt_exp_time = +JSON.parse(JWT_payload).exp;
    let now = new Date();
    let now_time = Math.floor(now.getTime() / 1000);
  
    return jwt_exp_time > now_time;
  }
  
  function b64DecodeUnicode(str) {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }
  
  async function Refresh() {
    localStorage.setItem("refresh_update_running", "1");
    let refresh = localStorage.getItem("refresh_token");
    let token = localStorage.getItem("token");
    let ip = localStorage.getItem('server_ip') + "/api/users/token_refresh";
    let res = await fetch(ip, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token-refresh": refresh,
        "x-token": token,
      },
    });
    if (res.ok) {
      let result = await res.json();
     
      if (result.access_token !== undefined) {
        localStorage.setItem("token", result.access_token);
      }
  
      localStorage.setItem("refresh_token", result.refresh_token);
    } else {
      localStorage.setItem("logged", false);
     
      window.location.href = '/login';
      return
      
    }
    localStorage.setItem("refresh_update_running", "0");
  }
  
  async function Jwt_proxy(func) {
    let jwt = localStorage.getItem("token");
    if (jwt === "null" || jwt === null) {
      localStorage.setItem("logged", false);
      window.location.href = '/login'; // Редирект на страницу '/login'
      return;
    }
    if (check_jwt_exp_time(jwt)) {
      func();
    } else {
      let refresh = localStorage.getItem("refresh_token");
      if (refresh === "null" || refresh === null) {
        localStorage.setItem("logged", false);
        window.location.href = '/login'; // Редирект на страницу '/login'
        return;
      }
      if (!check_jwt_exp_time(refresh)) {
        localStorage.setItem("logged", false);
        window.location.href = '/login'; // Редирект на страницу '/login'
        return;
      } else {
        await Refresh();
        let new_jwt = localStorage.getItem("token");
        if (new_jwt === "null") {
          localStorage.setItem("logged", false);
          window.location.href = '/login'; // Редирект на страницу '/login'
          return;
        }
        if (check_jwt_exp_time(new_jwt)) {
          await func();
        }
      }
    }
  }
  export default Jwt_proxy;