import './card.css';

export default function Card(props: { color?: string, value: string, showFace: boolean, x: number }) {
    const { color, value } = props;
    let cardValue = value === 'wildcard' ? 'wildcard' : `${color}-${numbersToText(value)}`;

    if (!props.showFace) {
        cardValue = 'cardback';
    }

    return (<>
        <div className={`card ${cardValue}`} style={{ top: 0, left: props.x, display: 'inline-block' }} />
    </>);
}

function numbersToText(value: string) {
    if (value === '1') {
        return 'one';
    }
    if (value === '2') {
        return 'two';
    }
    if (value === '3') {
        return 'three';
    }
    if (value === '4') {
        return 'four';
    }
    if (value === '5') {
        return 'five';
    }
    if (value === '6') {
        return 'six';
    }
    if (value === '7') {
        return 'seven';
    }
    if (value === '8') {
        return 'eight';
    }
    if (value === '9') {
        return 'nine';
    }
    if (value === '0') {
        return 'zero';
    }
    return value;
}
