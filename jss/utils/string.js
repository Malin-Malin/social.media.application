export function shortenStringLength(text, length) {
    if (!text) return '';
    
    if (text.length > length) {
        return text.slice(0, length) + '...';
    } else {
        return text;
    }
}