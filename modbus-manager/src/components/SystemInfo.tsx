import { FunctionComponent } from 'react';
import { TabsProps } from './DeviceManagerWindow.tsx';
import { FieldSection } from './FieldSection.tsx';

export const SystemInfo: FunctionComponent<TabsProps> = ({connection, device}) => {
    if (!connection.port) {
        return (
            <p>No port chosen</p>
        )
    }

    const {usbVendorId, usbProductId} = connection.port.getInfo();

    return (
        <>
            <FieldSection label="Vendor ID">
                <span>{usbVendorId}</span>
            </FieldSection>
            <FieldSection label="Product ID" >
                <span>{usbProductId}</span>
            </FieldSection>
            <FieldSection label="connection">
                <button onClick={connection.disconnect}>Disconnect</button>
            </FieldSection>
            <FieldSection label="Log">
                <button onClick={device.clearOutput}>Clear</button>
            </FieldSection>
        </>
    )
}
