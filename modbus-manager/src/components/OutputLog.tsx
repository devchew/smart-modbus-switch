import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { ModbusOutputLine } from '../helpers/modbus.ts';
import { ui8ToHexStr } from '../helpers/dataTransformers.ts';

export const OutputLog: FunctionComponent<{ output: ModbusOutputLine[], clear: () => void }> = ({ output, clear }) => {
    const scrollContainer = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (scrollContainer.current) {
            if (autoScroll) {
            // @ts-ignore
                scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
            }
        }
    }, [output]);
    return (
        <>
            <pre style={{height:200, overflow: 'auto', margin: '0 -5px -8px -5px'}} ref={scrollContainer}>
                <table style={{width: '100%', textAlign: 'left'}}>
                    <thead>
                    <tr>
                        <th>Direction</th>
                        <th>Raw</th>
                        <th>Parsed</th>
                        <th>Verbose</th>
                        <th>Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {output.map((line, i) => (
                        <tr key={i}>
                            <td>{line.direction}</td>
                            <td>{ui8ToHexStr(line.raw)}</td>
                            <td>address: {line.parsed.address}, func: {line.parsed.func}, length: {line.parsed.length},
                                payload: {ui8ToHexStr(line.parsed.payload)}</td>
                            <td>{line.verbose}</td>
                            <td>{new Date(line.timestamp).toLocaleTimeString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </pre>
            <hr/>
            <div style={{display: 'flex', flexDirection:'row', gap: 8}}>
                <section>
                    <input type="checkbox" id="autoscroll" onChange={(e) => setAutoScroll(e.target.checked)} checked={autoScroll}/>
                    <label htmlFor="autoscroll">autoscroll</label>
                </section>
                <section>
                    <a onClick={(e) => {e.preventDefault(); clear()}} href="#">clear</a>
                </section>
            </div>
        </>
    );
}
