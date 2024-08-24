import { FunctionComponent, useEffect, useState } from 'react';
import { useConnection } from '../hoocks/ConnectionProvider.tsx';

type Props = {};

const ui8ToHexStr = (ui8: Uint8Array) => {
    return Array.from(ui8).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

const hexStrToUi8 = (hexStr: string) => {
    return new Uint8Array(hexStr.split(' ').map(b => parseInt(b, 16)));
}

export const Terminal: FunctionComponent<Props> = () => {
    const {port, chosePort, send, subscribe, disconnect} = useConnection();

    const [output, setOutput] = useState("");

    useEffect(() => {
        if (port) {
            subscribe((data) => {
                setOutput(prev => prev + ui8ToHexStr(data) + '\n');
            });
        }
    }, [port]);

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
            <pre>{output}</pre>
            </>}


        </div>
    );
};
