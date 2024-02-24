export default function SongObject({ sourceImage, name, artists }: { sourceImage: string; name: string; artists: string }) {
    return (
        <div className="flex gap-1">
            <img src={sourceImage} alt="seletced_song" className="z-10 rounded-xl w-16 h-16"></img>
            <div className="ml-3 mb-3 flex justify-end flex-col">
                <p className="text-sm">{name}</p>
                <p className="text-xs opacity-60">{artists}</p>
            </div>
        </div>
    );
}
