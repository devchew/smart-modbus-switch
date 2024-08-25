export const ui8ToHexStr = (ui8: Uint8Array) => {
    return Array.from(ui8).map(b => b.toString(16).padStart(2, '0')).join(' ');
}
export const hexStrToUi8 = (hexStr: string) => {
    return new Uint8Array(hexStr.split(' ').map(b => parseInt(b, 16)));
}
export const ui8ToNumber = (ui8: Uint8Array) => ui8.length >= 4 ? new DataView(ui8.buffer).getUint32(0) : new DataView(ui8.buffer).getUint16(0);
