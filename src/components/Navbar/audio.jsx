import { useRef, useState } from "react";
import { MdOutlineMusicNote } from "react-icons/md";
import { MdOutlineMusicOff } from "react-icons/md";
import "../../../src/index.css";
const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume is 1 (100%)

  const handlePlay = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.volume = 0.1;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume; // Set the volume of the audio element
    }
  };

  return (
    <div className="sm:flex hidden justify-end items-center  px-4 py-2  text-white rounded-full hover:bg-gray-800 transition-all duration-200">
      {isPlaying ? (
        <button onClick={handlePause} className="text-white text-[20px]">
          <MdOutlineMusicNote />
        </button>
      ) : (
        <button onClick={handlePlay} className="text-white text-[20px]">
          <MdOutlineMusicOff />
        </button>
      )}

      <audio ref={audioRef} src="./videos/music.mp3" loop />
    </div>
  );
};

export default AudioPlayer;
