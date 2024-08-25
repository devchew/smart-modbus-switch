import { FunctionComponent } from 'react';
import { TabsProps } from './DeviceManagerWindow.tsx';
import Image from "./../assets/R4IO.jpg"
import { FieldSection } from './FieldSection.tsx';

export const DeviceControl: FunctionComponent<TabsProps> = ({device}) => {
    const {writeSingleOutput, writeMultipleOutputs, readInputs, inputsState} = device;
    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: 16}}>
            <img src={Image} alt="R4IO" height={300}/>
            <div style={{marginTop: 100}}>
                {inputsState.map((state, index) => (
                    <div className="field-row" key={`input-${index}`}>
                        <input checked={state} disabled type="checkbox" id={`input-${index}`}/>
                        <label htmlFor={`input-${index}`}>DI{index}</label>
                    </div>
                ))}
                {new Array(4).fill(0).map((_, index) => (
                    <div className="field-row" key={`output-${index+4}`}>
                        <input type="checkbox" key={index+4} id={`output-${index+4}`} onChange={(e) => writeSingleOutput(index+4, e.target.checked)}/>
                        <label htmlFor={`output-${index+4}`}>DO{index+4}</label>
                    </div>
                ))}
            </div>
            <div>
                <FieldSection label="Outputs">
                    <button onClick={() => writeMultipleOutputs([4, 5, 6, 7], true)}>Write all <b>true</b></button>
                    <button onClick={() => writeMultipleOutputs([4, 5, 6, 7], false)}>Write all <b>false</b></button>
                </FieldSection>
                <FieldSection label="Inputs">
                    <button onClick={() => readInputs()}>Read inputs</button>
                </FieldSection>
            </div>

        </div>
    )

}
