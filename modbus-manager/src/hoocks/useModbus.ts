import { Connection } from './ConnectionProvider.tsx';
import { useEffect, useState } from 'react';
import { hexStrToUi8 } from '../helpers/dataTransformers.ts';
import { addCRC, ModbusOutputLine, ModbusResponse, parseRawToModbusData } from '../helpers/modbus.ts';


export const useModbus = (
    connection: Connection,
    codesVerbose: (response: ModbusResponse, direction: ModbusOutputLine['direction']) => string = () => ''
) => {

    const [output, setOutput] = useState<ModbusOutputLine[]>([]);
    const appendOutput = (direction: ModbusOutputLine['direction'], data: Uint8Array) => setOutput(prev => [...prev,{
        direction,
        raw: data,
        parsed: parseRawToModbusData(data),
        verbose: codesVerbose(parseRawToModbusData(data), direction)
    }]);

    const send = (data: Uint8Array) => {
        connection.send(data);
        appendOutput('out', data);
    };

    const sendWithCRC = (data: Uint8Array) => send(addCRC(data));

    useEffect(() => {
        if (connection.port) {
            connection.subscribe((data) => appendOutput('in', data));
        }
    }, [connection.port]);


    const sendHexStr = (data: string) => sendWithCRC(hexStrToUi8(data))

    const clearOutput = () => setOutput([]);

    return {
        sendHexStr,
        output,
        clearOutput
    };
}
