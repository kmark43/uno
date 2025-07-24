import { shuffle } from "./util";

export interface Card {
    color?: string;
    value: string;
}

export interface User {
    socketId: string,
    hand: Card[]
}

export interface GameState {
    isGameWon: boolean,
    lastCard: Card,
    turnSocketId: string,
    remainingInHands: { socketId: string, cardsInHand: number }[]
}

class GameRoom {
    deck: Card[];
    users: User[];
    turn: number;
    lastCard: Card;
    
    constructor() {
        this.deck = this.createDeck();
        shuffle(this.deck);
        this.users = [];
        this.turn = -1;
        this.lastCard = this.deck.splice(0, 1)[0];
    }

    checkWin() {
        for (let user of this.users) {
            if (user.hand.length === 0) {
                return true;
            }
        }
        return false;
    }

    getGameState(): GameState {
        return {
            isGameWon: this.checkWin(),
            lastCard: this.lastCard,
            turnSocketId: this.users[this.turn].socketId,
            remainingInHands: this.users.map((user) => {
                return { socketId: user.socketId, cardsInHand: user.hand.length }
            }),
        };
    }

    getHand(socketId: string) {
        return this.users.find((user) => user.socketId === socketId)?.hand;
    }

    playMove(socketId: string, cardPosition: number): GameState {
        let user = this.users.find((user) => user.socketId === socketId);
        if (!user || this.users[this.turn] !== user) {
            return this.getGameState();
        }

        let card = user.hand[cardPosition];
        if (card.color !== this.lastCard.color && card.value !== this.lastCard.value) {
            return this.getGameState();
        }

        let lastCardPos = Math.floor(Math.random() * this.deck.length);
        this.deck.splice(lastCardPos, 0, this.lastCard);
        this.lastCard = user.hand[cardPosition];
        this.turn++;
        this.turn %= this.users.length;
        return this.getGameState();
    }

    addUser(socketId: string): User {
        const user = {
            socketId: socketId,
            hand: this.deck.splice(0, 7),
        };
        this.users.push(user);
        return user;
    }

    createDeck(): Card[] {
        const cards = [];
        for (let color of Array.of('red', 'green', 'blue', 'yellow')) {
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i <= 9; i++) {
                    cards.push({
                        color: color,
                        value: `${i}`
                    });
                }
                // cards.push({
                //     color: color,
                //     value: 'reverse'
                // });
                // cards.push({
                //     color: color,
                //     value: 'skip'
                // });
                // cards.push({
                //     color: color,
                //     value: 'drawtwo'
                // });
            }
        }
        // for (let i = 0; i < 4; i++) {
        //     cards.push({ value: 'wildcard' });
        // }
        return cards;
    }
}

export default GameRoom;