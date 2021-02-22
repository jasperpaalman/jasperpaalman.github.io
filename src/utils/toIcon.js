export default function toIcon(teamName: string) {
    return teamName
        ? `/static/icon/${teamName.replace(/[^\w]/gi, '')}.png`.toLowerCase()
        : null;
}
