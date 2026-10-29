import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";

export function SignIn({ token, setToken, userInfo, setUserInfo }) {
  async function getUserInfo({ token }) {
    const res = await fetch("http://localhost:8000/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userinfo = await res.json();

    return userinfo;
  }

  async function getToken({ user, password }) {
    const params = new URLSearchParams();
    params.append("username", user);
    params.append("password", password);

    const res = await fetch(`http://localhost:8000/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const token = await res.json();

    return token.access_token;
  }

  async function handleSignIn(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const user = formData.get("user");
    const password = formData.get("password");

    if (user && password) {
      const token = await getToken({ user: user, password: password });
      if (token) {
        setToken(token);
        localStorage.setItem("token", token);
        const userinfo = await getUserInfo({ token: token });

        setUserInfo({ username: userinfo.username, email: userinfo.email });
        localStorage.setItem("username", userinfo.username);
        localStorage.setItem("email", userinfo.email);
      }
    }
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setToken(null);
    setUserInfo({});
  }

  return (
    <div>
      {token ? (
        <div className="flex gap-2">
          <p>
            Signed in as: <b>{userInfo.username}</b> - {userInfo.email}
          </p>
          <button onClick={handleSignOut}>
            <LogOut />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSignIn}>
          <div className="flex gap-2">
            <input
              type="text"
              id="user"
              name="user"
              placeholder="username"
              className="border border-gray-300 y-2 p-2"
            />
            <input
              type="text"
              id="password"
              name="password"
              placeholder="password"
              className="border border-gray-300 y-2 p-2"
            />
            <button type="submit">
              <LogIn />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
