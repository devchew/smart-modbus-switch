import { Connection } from '../hoocks/ConnectionProvider.tsx';
import { useEffect, useState } from 'react';
import crc from 'crc/calculators/crc16modbus'

const ui8ToHexStr = (ui8: Uint8Array) => {
    return Array.from(ui8).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

const hexStrToUi8 = (hexStr: string) => {
    return new Uint8Array(hexStr.split(' ').map(b => parseInt(b, 16)));
}

const ui8ToNumber = (ui8: Uint8Array) => ui8.length >= 4 ? new DataView(ui8.buffer).getUint32(0) : new DataView(ui8.buffer).getUint16(0);

type ModbusResponse = {
    address: number;
    func: number;
    length: number;
    payload: Uint8Array;
}

export type OutputLine = {
    direction: 'in' | 'out'
    raw: Uint8Array
    parsed: ModbusResponse
    verbose: string
}

const parseRaw = (data: Uint8Array): ModbusResponse => {
    const address = data[0];
    const func = data[1];
    const length = data[2];
    const payload = data.slice(3, 3 + length);
    return { address, func, length, payload };
}

const Codes = {
    readOutput: 0x01,
    writeSingleOutput: 0x05,
    writeMultipleOutputs: 0x15,
    readDigitalInput: 0x02,
    readSlaveAddress: 0x03,
} as const;


const slaveAddresResponseParser = (response: ModbusResponse) => {
    if (response.func !== Codes.readSlaveAddress) {
        return;
    }

    const address: number = ui8ToNumber(response.payload);

    const verbose = `Read slave address: ${address}`;

    return {
        address,
        verbose
    }
}

const addCRC = (data: Uint8Array) => {
    const crcValue = crc(data);
    return new Uint8Array([...data, crcValue & 0xff, crcValue >> 8]);
}



export const useR4IO = (connection: Connection) => {

    const [output, setOutput] = useState<OutputLine[]>([]);
    const appendOutput = (direction: OutputLine['direction'], data: Uint8Array, verbose: string = '') => setOutput(prev => [...prev, {
        direction,
        raw: data,
        parsed: parseRaw(data),
        verbose
    }]);
    const [address, setAddress] = useState<number | undefined>(undefined);

    const send = (data: Uint8Array) => {
        connection.send(data);
        appendOutput('out', data);
    };

    const sendWithCRC = (data: Uint8Array) => send(addCRC(data));


    const parseResponse = (response: ModbusResponse) => [slaveAddresResponseParser].map(parser => parser(response)).find(Boolean)

    useEffect(() => {
        if (connection.port) {
            connection.subscribe((data) => {
                const result = parseResponse(parseRaw(data));
                if (result?.address) {
                    setAddress(result.address);
                }
                appendOutput('in', data, result?.verbose);
            });
        }
    }, [connection.port]);


    const readSlaveAddress = () => {
        sendWithCRC(hexStrToUi8(`FF ${Codes.readSlaveAddress} 00 FD 00 01 00`));
    }

    return {
        address,
        output,
        readSlaveAddress
    };
}
