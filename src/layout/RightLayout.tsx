import { useEffect, useState, useContext, useRef, useReducer } from "react";
import { Token } from "@/App";
import { IoTimeSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

import fetchHandler from "@/utils/fetchHandler";
import SongObject from "@/components/RightLayout/SongObject";

interface StateInterface {
  playlist: boolean;
  description: boolean;
  songs: boolean;
}

interface SpotifyInterface {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    preview_url: string;
    duration_ms: number;
  };
}

interface SpotifyResponseInterface {
  data: {
    items: SpotifyInterface[];
  };
}

const millisToMinutesAndSeconds = (millis: number) => {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
};
const reducer = (state: StateInterface, action: { type: string }) => {
  // eslint-disable-next-line
  switch (action.type) {
    case "playlist":
      state.playlist = true;
      break;
    case "description":
      state.description = true;
      break;
    case "songs":
      state.songs = true;
      break;
    case "d_none":
      state.description = false;
      break;
    case "p_none":
      state.playlist = false;
      break;
    case "s_none":
      state.songs = false;
      break;
  }
  return { ...state };
};

export default function RightLayout({
  playlist_state,
}: {
  playlist_state: any;
}) {
  const token = useContext(Token) as string;
  const [playlist] = playlist_state;
  const [list, setList] = useState<SpotifyResponseInterface | null>(null);

  const playlistEl = useRef<any>(null);
  const description = useRef<any>(null);
  const songsEl = useRef<any>(null);
  const [state, dispatch] = useReducer(reducer, {
    playlist: false,
    description: false,
    songs: false,
  });

  useEffect(() => {
    const callData = async () => {
      if (token !== undefined && playlist) {
        const response = await fetchHandler(
          token,
          `/v1/playlists/${playlist.id ? playlist.id : playlist?.items[0]?.id}/tracks`,
        );
        setList(response);
      }
    };
    callData();

    return () => {
      callData();
    };
  }, [token, playlist]);

  console.log(playlist);

  const handleScroll = (e: any) => {
    if (
      playlistEl.current?.getBoundingClientRect().bottom + 200 <
      e.target.scrollTop
    ) {
      dispatch({ type: "playlist" });
    } else if (
      playlistEl.current?.getBoundingClientRect().bottom + 200 >=
      e.target.scrollTop
    ) {
      dispatch({ type: "p_none" });
    }

    if (
      description.current?.getBoundingClientRect().top + 177 <
      e.target.scrollTop
    ) {
      dispatch({ type: "description" });
    } else if (
      description.current?.getBoundingClientRect().top + 177 >=
      e.target.scrollTop
    ) {
      dispatch({ type: "d_none" });
    }

    if (
      songsEl.current?.getBoundingClientRect().top + 183 <
      e.target.scrollTop
    ) {
      dispatch({ type: "songs" });
    } else if (
      songsEl.current?.getBoundingClientRect().top + 183 >=
      e.target.scrollTop
    ) {
      dispatch({ type: "s_none" });
    }
  };

  return (
    <div
      className="my-3 ml-2 flex h-[84vh] w-full flex-col overflow-y-auto rounded-xl bg-fixed text-white"
      onScroll={handleScroll}
    >
      <div
        ref={playlistEl}
        className="h-full w-full bg-gradient-to-b from-[#39E08C] to-[#121212] pb-5 text-7xl font-bold"
      >
        <div className="flex flex-row items-end gap-3 py-5 pl-10 transition duration-300 ease-in-out">
          <img
            src={playlist?.img ?? playlist?.items[0]?.images[0].url}
            alt="song"
            className="h-w-52 w-52 shadow-2xl"
          ></img>
          <div className="ml-5 flex flex-col gap-3">
            <div>
              <p className="text-sm">Playlist</p>
              <p className="text-6xl">
                {playlist?.name ?? playlist?.items[0].name}
              </p>
            </div>
            <p className="text-base font-light">
              Terdapat{" "}
              <strong className="text-lime-500">
                {playlist?.tracks ?? playlist?.items[0]?.tracks?.total}
              </strong>{" "}
              lagu
            </p>
          </div>
        </div>
      </div>
      <div ref={songsEl} className="w-full bg-[#121212]">
        <div
          ref={description}
          className="mt-14 flex items-center border-b border-b-gray-500 opacity-70"
        >
          <div className="ml-6 p-3">#</div>
          <div className="ml-5">Judul</div>
          <IoTimeSharp className="ml-[70%]" />
        </div>
        <AnimatePresence>
          {state.playlist && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="fixed top-3 z-50 flex w-[83%] flex-row items-end gap-3 rounded-tl-xl bg-[#228554] py-3 pl-10"
            >
              <img
                src={playlist?.img || playlist?.items[0].images[0].url}
                alt="song"
                className="h-10 w-10 shadow-2xl"
              ></img>
              <div className="flex flex-col pl-3">
                <p className="text-xl">
                  {playlist?.name || playlist?.items[0].name}
                </p>
                <p className="text-sm ">
                  {playlist?.owner || playlist?.items[0].owner.display_name}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {state.description && (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.1 }}
              className="fixed top-[84px] z-10 mb-3 flex w-[83%] items-center bg-[#1c1c1c] opacity-100"
            >
              <div className="ml-6 p-3 ">#</div>
              <div className="ml-5">Judul</div>
              <IoTimeSharp className="ml-[70%]" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="min-h-[38vh] py-7">
          {// eslint-disable-next-line
          list?.data?.items
            .filter((v) => v.track.preview_url !== undefined)
            .map((v, i) => {
              const name = v.track.name;
              const img = v.track.album.images[0].url;
              const artists: string = v.track.artists
                .map((v) => v.name)
                .join(", ");
              const class_name = `flex ${i < 9 ? "ml-[10px]" : "ml-[2px]"} p-3 gap-3 w-full`;
              return (
                <SongObject
                  key={v?.track?.id}
                  className={class_name}
                  index={i}
                  name={name}
                  img={img}
                  artists={artists}
                  duration_ms={millisToMinutesAndSeconds(v.track.duration_ms)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
