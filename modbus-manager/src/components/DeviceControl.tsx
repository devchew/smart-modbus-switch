import { FunctionComponent } from 'react';
import { TabsProps } from './DeviceManagerWindow.tsx';

export const DeviceControl: FunctionComponent<TabsProps> = ({device}) => {
    const {writeSingleOutput, writeMultipleOutputs, readInput} = device;
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
            <button onClick={() => writeMultipleOutputs([4, 6], true)}>Write outputs 4, 6 true</button>
            <button onClick={() => writeMultipleOutputs([5, 7], true)}>Write outputs 5, 7 true</button>
            <button onClick={() => writeMultipleOutputs([4, 6], false)}>Write outputs 4, 6 false</button>
            <button onClick={() => writeMultipleOutputs([5, 7], false)}>Write outputs 5, 7 false</button>
            <button onClick={() => writeMultipleOutputs([4, 5, 6, 7], true)}>Write all outputs true</button>
            <button onClick={() => writeMultipleOutputs([4, 5, 6, 7], false)}>Write all outputs false</button>
            <hr/>
            <button onClick={() => readInput(0)}>Read input 0</button>
            <button onClick={() => readInput(1)}>Read input 1</button>
            <button onClick={() => readInput(2)}>Read input 2</button>
            <button onClick={() => readInput(3)}>Read input 3</button>
            <button onClick={() => readInput(4)}>Read input 4</button>
        </div>
    )

}
