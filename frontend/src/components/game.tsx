import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { CardProps } from './hand';
import { useParams } from 'react-router-dom';

export interface RemainingInHand {
    socketId: string;
    cardsInHand: number;
}

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

    // We need to rotate the remainingInHands object because the
    // user could be in the middle of the object and thus
    // wouldn't appear correctly in the rotation if it's displayed
    // at the bottom of the screen while the others are at the top
    function rotateGameUsers(remainingInHands: RemainingInHand[]) {
        const k = remainingInHands.map(hand => hand.socketId).indexOf(socket.id!);

        for (let i = 0; i < k; i++) {
            const first = remainingInHands[0];
            for (let j = 0; j < remainingInHands.length - 1; j++) {
                remainingInHands[j] = remainingInHands[j + 1];
            }
            remainingInHands[remainingInHands.length - 1] = first;
        }

        return remainingInHands;
    }

    useEffect(() => {
        socket.emit('joinRoom', roomCode);

        socket.on('joinRoom', (socketId, gameState) => {

        })

        socket.on("selfJoinRoom", (socketId, user) => {
            user.hand;
        });
    }, []);
    return (
        <>
            Game room - {roomCode}
        </>
    );
}
