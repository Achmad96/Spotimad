import { useEffect } from "react";
import { createContext, useState } from "react";

import LeftLayout from "@/layout/LeftLayout";
import RightLayout from "@/layout/RightLayout";
import BottomLayout from "@/layout/BottomLayout";

const scope = ["user-read-playback-state", "user-modify-playback-state", "user-library-read", "user-read-currently-playing", "user-modify-playback-state"].join("%20");
export const Token = createContext<string | null>(null);

export default function App() {
    const [token, setToken] = useState<string | null>(null);
    const [playlist, setPlaylist] = useState();
    
    useEffect(() => {
        const hashParams: any = window.location.hash
            .substring(1)
            .split("&")
            .reduce((acc: any, param: string) => {
                const [key, value] = param.split("=");
                acc[key] = decodeURIComponent(value);
                return acc;
            }, {});

        if (hashParams.access_token) {
            setToken(hashParams.access_token);
        } else {
            const clientId = import.meta.env.VITE_VERCEL_CLIENT_ID as string;
            const redirectUri = import.meta.env.VITE_VERCEL_CLIENT_ID || "https://spotimad.vercel.app/";
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
        }
    }, []);

    return (
        <Token.Provider value={token}>
            <main className="flex flex-col bg-black h-screen overflow-hidden">
                <div className="flex flex-row">
                    <LeftLayout playlist_state={[playlist, setPlaylist]} />
                    <RightLayout playlist_state={[playlist, setPlaylist]} />
                </div>
                <BottomLayout />
            </main>
        </Token.Provider>
    );
}
