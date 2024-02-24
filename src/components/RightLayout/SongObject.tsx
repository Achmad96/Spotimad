export default function SongObject({ index, className, name, img, artists, duration_ms }: { index: number; className: string; name: string; img: string; artists: string; duration_ms: string }) {
    return (
        <div className="flex items-center ml-4 mr-4 rounded-md hover:bg-[#2B3731]">
            <p className="p-5">{index + 1}</p>
            <div className={className}>
                <img src={img} alt="song" className="w-10 h-10"></img>
                <div>
                    <p className="text-base">{name}</p>
                    <p className="text-xs opacity-50">{artists}</p>
                </div>
            </div>
            <p className="mr-[14rem]">{duration_ms}</p>
        </div>
    );
}
