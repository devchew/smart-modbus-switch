import { FunctionComponent, useEffect, useState } from 'react';
import { useConnection } from '../hoocks/ConnectionProvider.tsx';
import { useR4IO } from '../hoocks/useR4IO.ts';
import { ModbusOutputLine } from '../helpers/modbus.ts';

import { ui8ToHexStr } from '../helpers/dataTransformers.ts';

type Props = {};

const OutputLog: FunctionComponent<{ output: ModbusOutputLine[] }> = ({ output }) => {
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
    const { output, readSlaveAddress, address, writeSingleOutput, writeMultipleOutputs, readInput, sendHexStr } = useR4IO(connection);
    const [InputField, setInputField] = useState("");

    const {port, chosePort, disconnect} = connection;

    useEffect(() => disconnect, []);

    const write = async () => {
        if (!port) return;
        sendHexStr(InputField);
    }

    return (
        <div>

            <button onClick={chosePort}>Choose port</button>
            {port && <>
              <pre>{JSON.stringify(port.getInfo(), null, 2)}</pre>
              <button onClick={disconnect}>Disconnect</button>
              <input value={InputField} onChange={(e) => setInputField(e.target.value)}/>
              <button onClick={write}>Write</button>
              <hr/>
              <pre>{address}</pre>
              <button onClick={readSlaveAddress}>Read slave address</button>
              <br/>
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


              <h4>Output</h4>
              <OutputLog output={output}/>
            </>}


        </div>
    );
};
