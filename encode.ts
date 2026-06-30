const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

export function encodeBase62(num: number): string {
    if (num === 0) return ALPHABET[0];

    let code = "";
    while(num > 0) {
        const remainder = num % BASE;
        code = ALPHABET[remainder] + code;
        num = Math.floor(num / BASE);
    }
    return code;
}
