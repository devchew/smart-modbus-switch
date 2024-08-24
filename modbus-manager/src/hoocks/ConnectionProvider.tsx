import { createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface UseConnection {
    chosePort: () => void;
    port: SerialPort | null;
    subscribe: (onRead: (data: Uint8Array) => void) => void;
    send: (data: Uint8Array) => void;
    open: () => void;
    disconnect: () => void;
}

const ConnectionContext = createContext<UseConnection | undefined>(undefined);

export const ConnectionProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [port, setPort] = useState<SerialPort | null>(null);
    const [reader, setReader] = useState<ReadableStreamDefaultReader<Uint8Array> | null>(null);

    const chosePort = async () => {
        const selectedPort = await navigator.serial.requestPort();
        await selectedPort.open({ baudRate: 9600 });
        setPort(selectedPort);
    };

    const subscribe = (onRead: (data: Uint8Array) => void) => {
        if (!port || !port.readable) return;
        const reader = port.readable.getReader();
        setReader(reader);
        readFromPort(reader, onRead);
    };

    const send = async (data: Uint8Array) => {
        if (!port || !port.writable) return;
        const writer = port.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
    };

    const disconnect = async () => {
        if (reader) {
            await reader.cancel();
            reader.releaseLock();
            setReader(null);
        }
        if (port) {
            await port.close();
            setPort(null);
        }
    };

    const open = async () => {
        if (port) {
            await port.open({ baudRate: 9600 });
        }
    };

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return (
        <ConnectionContext.Provider value={{ chosePort, port, subscribe, send, open, disconnect }}>
            {children}
        </ConnectionContext.Provider>
    );
};

const readFromPort = async (reader: ReadableStreamDefaultReader<Uint8Array>, onRead: (data: Uint8Array) => void, debounceTime = 10) => {
    let buffer = new Uint8Array();
    let timeoutId: number | null = null;

    const debounce = (data: Uint8Array) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            onRead(data);
            buffer = new Uint8Array();
        }, debounceTime);
    };

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                reader.releaseLock();
                break;
            }
            if (value) {
                buffer = new Uint8Array([...buffer, ...value]);
                debounce(buffer);
            }
        }
    } catch (error) {
        console.error('Error reading from port:', error);
    }
};

export const useConnection = () => {
    const context = useContext(ConnectionContext);
    if (context === undefined) {
        throw new Error('useConnection must be used within a ConnectionProvider');
    }
    return context;
};
