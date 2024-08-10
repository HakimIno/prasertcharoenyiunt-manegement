type AvatarColor =
    | 'ruby'
    | 'red'
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'green';

export const getColorByCharacter = (char: string): AvatarColor => {
    const colorMap: Record<string, AvatarColor> = {
        a: 'crimson',
        b: 'orange',
        c: 'blue',
        d: 'green',
        e: 'purple',
        f: 'pink',
        g: 'yellow',
        h: 'brown',
        i: 'indigo',
        j: 'red',
        k: 'amber',
        l: 'violet',
        m: 'plum',
        n: 'bronze',
        o: 'tomato',
        p: 'gold',
        q: 'iris',
        r: 'blue',
        s: 'gray',
        t: 'gray',
        u: 'ruby',
        v: 'pink',
        w: 'plum',
        x: 'yellow',
        y: 'iris',
        z: 'ruby',
    };

    return colorMap[char.toLowerCase()] || 'gray';
};
