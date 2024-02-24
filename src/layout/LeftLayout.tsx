import Playlist from "@/components/LeftLayout/Playlist";
import UserProfile from "@/components/LeftLayout/UserProfile";

export default function LeftLayout({ playlist_state }: any) {
    return (
        <aside className="flex flex-col ml-1 mt-3 mb-2 gap-2">
            <UserProfile />
            <Playlist playlist_state={playlist_state} />
        </aside>
    );
}
