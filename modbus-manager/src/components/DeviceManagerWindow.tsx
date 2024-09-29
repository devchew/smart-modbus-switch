import { FunctionComponent } from 'react';
import { Window } from './Window.tsx';
import { Tabs } from './Tabs.tsx';
import { Connection, useConnection } from '../hoocks/ConnectionProvider.tsx';
import { useR4IO } from '../hoocks/useR4IO.ts';
import { OutputLog } from './OutputLog.tsx';
import { DeviceControl } from './DeviceControl.tsx';
import { DeviceConfig } from './DeviceConfig.tsx';
import { SystemInfo } from './SystemInfo.tsx';
import HomeAssistant from './HomeAssistant.tsx';


export interface TabsProps {
    device: ReturnType<typeof useR4IO>;
    connection: Connection;
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
                },
                {
                    title: 'Home Assistant',
                    id: 'ha',
                    component: (<HomeAssistant connection={connection} device={device} />)
                }
            ]} />
            <OutputLog output={device.output} clear={device.clearOutput}/>
        </Window>
    )
}
