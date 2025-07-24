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

    playMove(socketId: string, cardPosition: number) {
        let user = this.users.find((user) => user.socketId === socketId);
        if (!user) {
            return false;
        }

        let card = user.hand[cardPosition];
        if (card.color !== this.lastCard.color && card.value !== this.lastCard.value) {
            return false;
        }

        let lastCardPos = Math.floor(Math.random() * this.deck.length);
        this.deck.splice(lastCardPos, 0, this.lastCard);
        this.lastCard = user.hand[cardPosition];
        return {
            lastCard: this.lastCard,

        };
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