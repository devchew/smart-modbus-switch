import { FunctionComponent, useState } from 'react';
import { TabsProps } from './DeviceManagerWindow.tsx';
import { FieldSection } from './FieldSection.tsx';

const pluginLink = "https://www.home-assistant.io/integrations/modbus/";

const generateConfig = (address: string, name: string, deviceClass: string) => `
modbus:
  - name: "modbus_hub"
    type: serial
    method: rtu
    port: "/dev/ttyUSB0"   # Replace with your actual port
    baudrate: 9600
    stopbits: 1
    bytesize: 8
    parity: N
    delay: 1
    timeout: 5
    message_wait_milliseconds: 100

    binary_sensors:
      - name: "${name} 1"
        device_class: ${deviceClass}
        slave: ${address}
        address: 0
        input_type: discrete_input
        scan_interval: 5

      - name: "${name} 2"
        device_class: ${deviceClass}
        slave: ${address}
        address: 1
        input_type: discrete_input
        scan_interval: 5

      - name: "${name} 3"
        device_class: ${deviceClass}
        slave: ${address}
        address: 2
        input_type: discrete_input
        scan_interval: 5

      - name: "${name} 4"
        device_class: ${deviceClass}
        slave: ${address}
        address: 3
        input_type: discrete_input
        scan_interval: 5`

const deviceClasses: string[] = [
    "None",
    "battery",
    "battery_charging",
    "carbon_monoxide",
    "cold",
    "connectivity",
    "door",
    "garage_door",
    "gas",
    "heat",
    "light",
    "lock",
    "moisture",
    "motion",
    "moving",
    "occupancy",
    "opening",
    "plug",
    "power",
    "presence",
    "problem",
    "running",
    "safety",
    "smoke",
    "sound",
    "tamper",
    "update",
    "vibration",
    "window"
];

const HomeAssistant: FunctionComponent<TabsProps> = ({ device }) => {
    const [inputName, setInputName] = useState("window");
    const [deviceClass, setDeviceClass] = useState("window");
  return (<div>
      <FieldSection label="Address">
          <input type="text" value={device.address} disabled
                 style={{backgroundColor: '#dfdfdf', borderColor: '#a8a8a8'}}/>
          <button onClick={device.readSlaveAddress}>Read</button>
      </FieldSection>
      <FieldSection label="Inputs name">
            <input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)}/>
      </FieldSection>
        <FieldSection label="Device class">
            <select value={deviceClass} onChange={(e) => setDeviceClass(e.target.value)}>
                {deviceClasses.map((deviceClass) => <option
                    key={deviceClass}
                    value={deviceClass}>{deviceClass}</option>)}
            </select>
            <small>https://www.home-assistant.io/integrations/binary_sensor/#device-class</small>
        </FieldSection>
      <FieldSection label="Home Assistant config.yaml">
          <textarea value={generateConfig(device.address, inputName, deviceClass)} readOnly
                    style={{width: '100%', height: '200px', fontFamily: 'monospace'}}/>
      </FieldSection>
      <p>
            For more information visit
            {' '}
          <a href={pluginLink}>Plugin documentation</a>
      </p>
  </div>);
};

export default HomeAssistant;
