import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { CardProps } from './hand';
import { useParams } from 'react-router-dom';

export interface User {
    id: string;
    isSelf: boolean;
    hand: CardProps[];
}

export default function Game() {
    // if the game is running
    // the deck
    // the discard pile
    // hands for each player
    // current value
    // current color
    // whos turn
    // 
    // give player N cards
    // play card to deck
    // update whose turn it is
    // game win screen
    const { roomCode } = useParams();
    const [isGameRunning, setGameRunning] = useState(false);
    const [users, setUsers] = useState([]);

    function initGameState() {
        setGameRunning(true);
    }

    useEffect(() => {
        socket.emit('joinRoom', roomCode);

        socket.on("giveNCards", (cards, socketId) => {

        });
    }, []);
    return (
        <>
            Game room - {roomCode}
        </>
    );
}
