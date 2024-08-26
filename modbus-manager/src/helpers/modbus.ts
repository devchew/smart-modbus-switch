import crc from 'crc/calculators/crc16modbus';

export type ModbusResponse = {
    address: number;
    func: number;
    length: number;
    payload: Uint8Array;
}
export type ModbusOutputLine = {
    direction: 'in' | 'out'
    raw: Uint8Array
    parsed: ModbusResponse
    verbose: string
    timestamp: number
}
export const parseRawToModbusData = (data: Uint8Array): ModbusResponse => {
    const address = data[0];
    const func = data[1];
    const length = data[2];
    const payload = data.slice(3, 3 + length);
    return {address, func, length, payload};
}
export const addCRC = (data: Uint8Array) => {
    const crcValue = crc(data);
    return new Uint8Array([...data, crcValue & 0xff, crcValue >> 8]);
}
