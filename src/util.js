export function mapObject(obj: any, callbackfn: (string, any) => void) {
    return Object.keys(obj).map((key) => callbackfn(key, obj[key]));
}

export function joinObjects(target: any, added: any) {
    // eslint-disable-next-line
    return Object.keys(added).forEach(key => target[key] = added[key]);
}

export function toIcon(teamName: string) {
    return teamName
        ? `/static/icon/${teamName.replace(/[^\w]/gi, '')}.png`.toLowerCase()
        : null;
}
