import { FunctionComponent, useEffect, useState } from 'react';
import { useConnection } from '../hoocks/ConnectionProvider.tsx';
import { OutputLine, useR4IO } from '../hoocks/useR4IO.ts';

type Props = {};

const ui8ToHexStr = (ui8: Uint8Array) => {
    return Array.from(ui8).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

const hexStrToUi8 = (hexStr: string) => {
    return new Uint8Array(hexStr.split(' ').map(b => parseInt(b, 16)));
}

const OutputLog: FunctionComponent<{ output: OutputLine[] }> = ({ output }) => {
    return (
        <table style={{width: '100%', textAlign: 'left'}}>
            <thead>
                <tr>
                    <th>Direction</th>
                    <th>Raw</th>
                    <th>Parsed</th>
                    <th>Verbose</th>
                </tr>
            </thead>
            <tbody>
                {output.map((line, i) => (
                    <tr key={i}>
                        <td>{line.direction}</td>
                        <td>{ui8ToHexStr(line.raw)}</td>
                        <td>address: {line.parsed.address}, func: {line.parsed.func}, length: {line.parsed.length}, payload: {ui8ToHexStr(line.parsed.payload)}</td>
                        <td>{line.verbose}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export const Terminal: FunctionComponent<Props> = () => {
    const connection = useConnection();
    const { output, readSlaveAddress, address } = useR4IO(connection);

    const {port, chosePort, send, disconnect} = connection;


    useEffect(() => disconnect, []);

    const write = async () => {
        if (!port) return;
        send(hexStrToUi8('01 01 00 00 00 08 3D CC'));
    }

    return (
        <div>

            <button onClick={chosePort}>Choose port</button>
            {port && <>
              <pre>{JSON.stringify(port.getInfo(), null, 2)}</pre>
                <button onClick={disconnect}>Disconnect</button>
                <button onClick={write}>Write</button>
                <hr />
                <pre>{address}</pre>
                <button onClick={readSlaveAddress}>Read slave address</button>
                <h4>Output</h4>
                <OutputLog output={output} />
            </>}


        </div>
    );
};
