import Card from "./card";

export interface CardProps {
    color?: string;
    value: string
}

export default function Hand(props: { ownHand: boolean, cards: CardProps[] }) {
    return <>
        <div className="hand" style={{whiteSpace: 'nowrap'}}>
            {props.cards.map((card, index) => {
                return (
                    <Card color={card.color} value={card.value} showFace={props.ownHand} x={index * -110} />
                )
            })}
        </div>
    </>
}
