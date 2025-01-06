import type { NextApiRequest, NextApiResponse } from 'next';
import { decode } from 'punycode';

interface body {
    json:{
        email: string;
        password: string;
        push_endpoint: string;
        push_p256dh: ArrayBuffer;
        push_auth:ArrayBuffer;
    }
}

interface ResponseBody {
    statusCode: number;
    responseBody: string;
    message: string;
}

function base64toArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === "POST") {
        const BASE_URL = "http://127.0.0.1:8080/api/account_create";
        let body = req.body;
        let json = JSON.parse(body);
        let endpoind = json.push_endpoint;
        let p256dh = base64toArrayBuffer(json.push_p256dh);
        let auth = base64toArrayBuffer(json.push_auth);
        console.log(p256dh);
        const bodyData: body = {
            json:{
                email: json.email,
                password: json.password,
                push_endpoint: endpoind,
                push_p256dh: p256dh,
                push_auth: auth
            }
        };

        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const responseBody = await response.text();

            const responsePayload: ResponseBody = {
                statusCode: response.status,
                responseBody,
                message: response.ok
                    ? "Account created successfully"
                    : "Failed to create account",
            };

            res.status(response.status).json(responsePayload);
        } catch (error) {
            res.status(500).json({ error: "Error connecting to Rust server" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
