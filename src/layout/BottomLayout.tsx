// import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
// import { BsSkipStartFill, BsFillSkipEndFill } from "react-icons/bs";
// import SpotifyPlayer from "react-spotify-web-playback";

import { useEffect, useState, useContext } from "react";
import { Token } from "@/App";
import fetchHandler from "@/utils/fetchHandler";
import SongObject from "@/components/BottomLayout/SongObject";

interface SongInterface {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    preview_url: string;
    duration_ms: number;
}

export default function BottomLayout() {
    const token = useContext(Token) as string;
    const [isPlaying, setPlaying] = useState(false);
    const [songObject, setSongObject] = useState<SongInterface | null>(null);


    // const handlePrevAndNext = async (type: string) => {
    //     return await fetchHandler(token, `/v1/me/player/${type}`, "post").then(() => setPlaying(true));
    // };

    // const handleSong = async () => {
    //     const device_id = "16bd04e11348489421f2cd765d3b07b70fa8ecfb";
    //     const context_uri = "spotify:playlist:6AGdPxT2tGSKcbSGhGaylj";
    //     if (isPlaying) {
    //         return await fetchHandler(token, `/v1/me/player/pause?device_id=${device_id}`, "put").then(() => setPlaying(false));
    //     }

    //     return await fetchHandler(token, `/v1/me/player/play?device_id=${device_id}`, "put", {
    //         body: {
    //             context_uri,
    //             offset: {
    //                 position: 0,
    //             },
    //             position_ms: 0,
    //         },
    //     })
    //         .then(() => setPlaying(true))
    //         .catch(error => console.log(error));
    // };

    useEffect(() => {
        if (token) {
            setTimeout(() => {
                const callData = async () => {
                    const response = await fetchHandler(token, "/v1/me/player/currently-playing");
                    if (response.data.is_playing && isPlaying) setPlaying(true);
                    setSongObject(response.data.item);
                };
                callData();
            }, 5000);
        }
    }, [token, isPlaying, songObject]);
    return (
        <footer className="flex items-center z-10 bg-[#121212] w-[100%] h-[15vh] text-white gap-5">
            <div className="ml-5 w-[43rem]">
                {songObject && <SongObject sourceImage={songObject?.album.images[0].url} name={songObject?.name} artists={songObject?.artists.map(v => v.name).join(", ")} />}
            </div>
            <div className="flex flex-row items-center gap-5">
                {/* <BsSkipStartFill className="w-7 h-7 opacity-70 hover:opacity-100" onClick={() => handlePrevAndNext("previous")} />
                {isPlaying ? (
                    <FaPauseCircle className="w-9 h-9 opacity-70 hover:opacity-100" onClick={handleSong} />
                ) : (
                    <FaPlayCircle className="w-9 h-9 opacity-70 hover:opacity-100" onClick={handleSong} />
                )}
                <BsFillSkipEndFill className="w-7 h-7 opacity-70 hover:opacity-100" onClick={() => handlePrevAndNext("next")} /> */}
                {/* {token && <SpotifyPlayer token={token} uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]} />} */}
            </div>
            <div className="w-[43rem] flex justify-end">
                <input type="range" defaultValue="50" className="w-24 h-1 mr-10 " />
            </div>
        </footer>
    );
}
