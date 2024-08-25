import { FunctionComponent, useState } from 'react';
import { TabsProps } from './DeviceManagerWindow.tsx';
import { FieldSection } from './FieldSection.tsx';

export const DeviceConfig: FunctionComponent<TabsProps> = ({device, connection}) => {
    const [InputField, setInputField] = useState("");
    const [autoUpdateInterval, setAutoUpdateInterval] = useState(0)
    const [newAddress, setNewAddress] = useState('01')

    const write = async () => {
        if (!connection.port) return;
        device.sendHexStr(InputField);
    }

    return (
        <div>
            <FieldSection label="Address">
                <input type="text" value={device.address} disabled
                       style={{backgroundColor: '#dfdfdf', borderColor: '#a8a8a8'}}/>
                <button onClick={device.readSlaveAddress}>Read</button>
            </FieldSection>
            <FieldSection label="Set address">
                <input type="text" id="newAddress" value={newAddress} onChange={(e) => setNewAddress(e.target.value)}/>
                <button onClick={() => device.setSlaveAddress(newAddress)}>Set</button>
            </FieldSection>
            <FieldSection label="Send hex value">
                <input value={InputField} onChange={(e) => setInputField(e.target.value)} type="text"
                       id="customCommand"/>
                <button onClick={write}>Write</button>
            </FieldSection>
            <FieldSection label="Auto update interval (s)">
                <input type="text" value={autoUpdateInterval} onChange={(e) => setAutoUpdateInterval(parseInt(e.target.value))}/>
                <button onClick={() => device.setAutoReportInputs(autoUpdateInterval)}>Set</button>
            </FieldSection>
        </div>
    )
}
