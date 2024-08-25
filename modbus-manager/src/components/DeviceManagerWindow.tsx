import { FunctionComponent, useState } from 'react';
import { Window } from './Window.tsx';
import { Tabs } from './Tabs.tsx';
import { Connection, useConnection } from '../hoocks/ConnectionProvider.tsx';
import { useR4IO } from '../hoocks/useR4IO.ts';
import { OutputLog } from './OutputLog.tsx';


interface TabsProps {
    device: ReturnType<typeof useR4IO>;
    connection: Connection;
}

const DeviceControl: FunctionComponent<TabsProps> = ({device}) => {
    const { writeSingleOutput, writeMultipleOutputs, readInput } = device;
    return (
        <div>
            <button onClick={() => writeSingleOutput(4, true)}>Write output 4 true</button>
            <button onClick={() => writeSingleOutput(4, false)}>Write output 4 false</button>
            <br/>
            <button onClick={() => writeSingleOutput(5, true)}>Write output 5 true</button>
            <button onClick={() => writeSingleOutput(5, false)}>Write output 5 false</button>
            <br/>
            <button onClick={() => writeSingleOutput(6, true)}>Write output 6 true</button>
            <button onClick={() => writeSingleOutput(6, false)}>Write output 6 false</button>
            <br/>
            <button onClick={() => writeSingleOutput(7, true)}>Write output 7 true</button>
            <button onClick={() => writeSingleOutput(7, false)}>Write output 7 false</button>
            <br/>
            <button onClick={() => writeMultipleOutputs([4,6], true)}>Write outputs 4, 6 true</button>
            <button onClick={() => writeMultipleOutputs([5,7], true)}>Write outputs 5, 7 true</button>
            <button onClick={() => writeMultipleOutputs([4,6], false)}>Write outputs 4, 6 false</button>
            <button onClick={() => writeMultipleOutputs([5,7], false)}>Write outputs 5, 7 false</button>
            <button onClick={() => writeMultipleOutputs([4,5,6,7], true)}>Write all outputs true</button>
            <button onClick={() => writeMultipleOutputs([4,5,6,7], false)}>Write all outputs false</button>
            <hr/>
            <button onClick={() => readInput(0)}>Read input 0</button>
            <button onClick={() => readInput(1)}>Read input 1</button>
            <button onClick={() => readInput(2)}>Read input 2</button>
            <button onClick={() => readInput(3)}>Read input 3</button>
            <button onClick={() => readInput(4)}>Read input 4</button>
        </div>
    )

}

const DeviceConfig: FunctionComponent<TabsProps> = ({device, connection}) => {
    const [InputField, setInputField] = useState("");

    const write = async () => {
        if (!connection.port) return;
        device.sendHexStr(InputField);
    }

    return (
        <div>
            <section className="field-row">
                <label>Address</label>
                <input type="text" value={device.address} disabled style={{backgroundColor: '#dfdfdf', borderColor: '#a8a8a8'}}/>
                <button onClick={device.readSlaveAddress}>Read</button>
            </section>
            <section className="field-row">
                <label htmlFor="customCommand">Write hex value</label>
                <input value={InputField} onChange={(e) => setInputField(e.target.value)} type="text" id="customCommand"/>
                <button onClick={write}>Write</button>
            </section>
        </div>
    )
}

const SystemInfo: FunctionComponent<TabsProps> = ({connection, device}) => {
    if (!connection.port){
        return (
            <p>No port chosen</p>
        )
    }

    const { usbVendorId, usbProductId} = connection.port.getInfo();

    return (
        <>
            <section className="field-row">
                <label>Vendor ID</label>
                <span>{usbVendorId}</span>
            </section>
            <section className="field-row">
                <label>Product ID</label>
                <span>{usbProductId}</span>
            </section>
            <section className="field-row">
                <label>connection</label>
                <button onClick={connection.disconnect}>Disconnect</button>
            </section>
            <section className="field-row">
                <label>Log</label>
                <button onClick={device.clearOutput}>Clear</button>
            </section>
        </>
    )
}


export const DeviceManagerWindow: FunctionComponent = () => {
    const connection = useConnection();
    const device = useR4IO(connection);

    if (!connection.port) {
        return (
            <Window title="Device Manager">
                <p>No port chosen</p>
                <button onClick={connection.chosePort}>Choose port</button>
            </Window>
        )
    }

    return (
        <Window title="Device Manager">
            <Tabs tabs={[
                {
                    title: 'Device Control',
                    id: 'control',
                    component: (<DeviceControl connection={connection} device={device} />)
                },
                {
                    title: 'Device Configuration',
                    id: 'config',
                    component: (<DeviceConfig connection={connection} device={device} />)
                },
                {
                    title: 'System Info',
                    id: 'sysinfo',
                    component: (<SystemInfo connection={connection} device={device} />)
                }
            ]} />
            <OutputLog output={device.output} clear={device.clearOutput}/>
        </Window>
    )
}
