import React, { useState } from "react";
import { useNotification } from "@/notifications/useNotification";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { subscription } = useNotification();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const arrayBufferToBase64Url = (
    buffer: ArrayBuffer | null
  ): string | null => {
    if (!buffer) return null;
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window
      .btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
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
    formData.append(
      "json",
      new Blob([JSON.stringify(loginData)], { type: "application/json" })
    );

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Login successful");
        router.push("/dashboard");
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
      <h2 className="text-xl font-bold mb-4">ログイン</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label>メールアドレス</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
      </div>
      <div>
        <label>パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />
      </div>
      <button
        onClick={handleLogin}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
      >
        ログイン
      </button>
    </div>
  );
};

export default LoginPage;
