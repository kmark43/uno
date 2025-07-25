import { useEffect, useState } from 'react';
import { socket } from '../socket';
import Hand, { CardProps } from './hand';
import { useParams } from 'react-router-dom';
import './game.css';
import Card from './card';

export interface RemainingInHand {
    socketId: string;
    cardsInHand: number;
}

export interface OtherUser {
    id: string;
    cardsInHand: RemainingInHand[];
}

export interface GameState {
    isGameWon: boolean,
    lastCard: CardProps,
    turnSocketId: string,
    remainingInHands: { socketId: string, cardsInHand: number }[]
}

export interface User {
    id: string;
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
    const [user, setUser] = useState<User>();
    const [otherUsers, setOtherUsers] = useState<RemainingInHand[]>([]);
    const [lastCard, setLastCard] = useState<CardProps>();
    const [turn, setTurn] = useState<string>('');

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
        remainingInHands.splice(0, 1);

        return remainingInHands;
    }

    function updateGameState(gameState: GameState) {
        setGameRunning(!gameState.isGameWon);
        setLastCard(gameState.lastCard);
        setTurn(gameState.turnSocketId);
        setOtherUsers(rotateGameUsers(gameState.remainingInHands));
    }

    function updateHand(hand: CardProps[]) {
        // setUser()
    }

    useEffect(() => {
        console.log('emitting joinRoom');
        socket.emit('joinRoom', roomCode);

        socket.on('joinRoom', (socketId, gameState) => {
            updateGameState(gameState);
        });

        socket.on("selfJoinRoom", (socketId, hand) => {
            setUser({
                id: socket.id!,
                hand: hand,
            });
        });

        socket.on('updateGameState', (gameState) => {
            updateGameState(gameState);
        });

        socket.on('updateHand', (hand) => {
            setUser({
                id: socket.id!,
                hand: hand,
            });
        });
    }, []);

    function fillCards(numCards: number) {
        let cards: CardProps[] = [];
        for (let i = 0; i < numCards; i++) {
            cards.push({
                value: 'wildcard'
            });
        }
        return cards;
    }

    return (
        <>
            <div className='otherUsers'>
                {otherUsers.map((user) => {
                    return (<Hand ownHand={false} cards={fillCards(user.cardsInHand)} />);
                })}
            </div>
            <div className='deck'>
                {lastCard && <Card color={lastCard.color} value={lastCard.value} showFace={true} x={0} />}
            </div>
            <div className='ownHand'>
                {user && <Hand ownHand={true} cards={user.hand} />}
            </div>
        </>
    );
}
