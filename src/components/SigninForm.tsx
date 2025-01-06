import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/notifications/useNotification";

export const SigninForm = () => {
  const { subscription } = useNotification();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const arrayBufferToBase64Url = (buffer: ArrayBuffer | null): string | null => {
    if (!buffer) return null;
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const handleAccountCreate = async () => {
    let endpoint = subscription?.endpoint;
    let p256dh = arrayBufferToBase64Url(subscription?.getKey("p256dh") || null);
    let auth = arrayBufferToBase64Url(subscription?.getKey("auth") || null);

    const test_data = {
      email: email,
      password: password,
      push_endpoint: endpoint,
      push_p256dh: p256dh,
      push_auth: auth,
    };

    const formData = new FormData();
    formData.append("json", new Blob([JSON.stringify(test_data)], { type: "application/json" }));

    try {
      const response = await fetch("http://127.0.0.1:3001/api/account_create", {
        method: "POST",
        body: formData,
      });

      console.log("Status Code:", response.status);
      const responseBody = await response.text();
      console.log("Response Body:", responseBody);

      if (response.ok) {
        console.log("Account created successfully");
        router.push("/account-created");
      } else if (response.status === 409) {
        console.error("Email already exists");
        setError("Email already exists. Redirecting to login page...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        console.error("Failed to create account");
        if (responseBody) {
          const parsedResponse = JSON.parse(responseBody);
          setError(parsedResponse.error || "Failed to create account. Please try again.");
        } else {
          setError("すでにアカウントが作成されている可能性があります．ログインしてみてください．");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleLogin = async () => {
    let endpoint = subscription?.endpoint;
    let p256dh = arrayBufferToBase64Url(subscription?.getKey("p256dh") || null);
    let auth = arrayBufferToBase64Url(subscription?.getKey("auth") || null);

    const loginData = {
      email: email,
      password: password,
      push_endpoint: endpoint,
      push_p256dh: p256dh,
      push_auth: auth,
    };

    const formData = new FormData();
    formData.append("json", new Blob([JSON.stringify(loginData)], { type: "application/json" }));

    try {
      const response = await fetch("http://127.0.0.1:3001/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Login successful");
        router.push("/account-created");
      } else {
        console.error("Login failed");
        setError("Login failed. Please check your email and password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">アカウント作成</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); handleAccountCreate(); }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
        >
          アカウント作成
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4 mt-6">ログイン</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
        >
          ログイン
        </button>
      </form>
    </div>
  );
};

export default SigninForm;