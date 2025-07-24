import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState('');

    function handleJoinRoom() {
        navigate(`/games/${roomCode}`);
    }

    return (
        <>
            <label htmlFor="roomCode">Room Code:</label><input onChange={(e) => setRoomCode(e.target.value)} name='roomCode' type='text' />
            <button onClick={handleJoinRoom} name='joinRoom'>Join Room</button>
        </>
    );
}