import { Connection } from './ConnectionProvider.tsx';
import { useState } from 'react';
import { intToHex, ui8ToNumber } from '../helpers/dataTransformers.ts';
import { ModbusOutputLine, ModbusResponse } from '../helpers/modbus.ts';
import { useModbus } from './useModbus.ts';

export const Codes = {
    readOutput: 0x01,
    writeSingleOutput: 0x05,
    writeMultipleOutputs: 0x0F,
    readDigitalInput: 0x02,
    readSlaveAddress: 0x03,
    writeSlaveAddress: 0x06,
} as const;



export const useR4IO = (connection: Connection) => {
    const [address, setAddress] = useState<string>('FF');
    const [inputsState, setInputsState] = useState([false, false, false, false]);

    const responseParser = (response: ModbusResponse, direction: ModbusOutputLine["direction"]): string => {
        if (response.address === 0xFF && response.func === Codes.readSlaveAddress && direction === 'in') {
            const address: number = ui8ToNumber(response.payload);
            setAddress(intToHex(address));
            return `Read slave address: ${address}`;
        }
        // read multiple inputs
        if (response.func === 3 && direction === 'in') {
            const input = response.payload[1];
            const binary = input.toString(2).padStart(4, '0');
            setInputsState(binary.split('').reverse().map(bit => bit === '1'));
            return `Read inputs ${binary}`;
        }
        if (response.func === 2 && direction === 'in') {
            const input = response.payload[0];
            const binary = input.toString(2).padStart(4, '0');
            setInputsState(binary.split('').reverse().map(bit => bit === '1'));
            return `Read inputs ${binary}`;
        }
        return '';
    }

    const { sendHexStr, output, clearOutput } = useModbus(connection, responseParser);

    const writeSingleOutput = (output: number, value: boolean) => {
        const outputHex = output.toString(16).padStart(2, '0');
        sendHexStr(`${address} ${intToHex(Codes.writeSingleOutput)} 00 ${outputHex} ${value ? 'FF' : '00'} 00`);
    }

    const writeMultipleOutputs = (outputs: number[], value: boolean) => {
        const stateBin = outputs.reduce((output, pin) => {
            output[pin] = value ? '1' : '0';
            return output;
        }, '00000000'.split('')).reverse().join('')
        const stateHex = intToHex(parseInt(stateBin, 2));
        sendHexStr(`${address} ${intToHex(Codes.writeMultipleOutputs)} 00 00 00 08 01 ${stateHex}`);
    }

    const readInputs = () => {
        sendHexStr(`${address} ${intToHex(Codes.readDigitalInput)} 00 00 00 04`);
    }

    const readSlaveAddress = () => {
        sendHexStr(`FF ${intToHex(Codes.readSlaveAddress)} 00 FD 00 01 00`);
    }

    const setAutoReportInputs = (interval: number) => {
        sendHexStr(`${address} 06 00 F8 00 ${intToHex(interval)}`);
    }

    const setSlaveAddress = (newAddress: number) => {
        sendHexStr(`FF ${intToHex(Codes.writeSlaveAddress)} 00 FD 00 ${intToHex(newAddress)}`);
    }

    return {
        address,
        output,
        inputsState,
        clearOutput,
        readSlaveAddress,
        readInputs,
        writeSingleOutput,
        writeMultipleOutputs,
        sendHexStr,
        setAutoReportInputs,
        setSlaveAddress
    };
}
