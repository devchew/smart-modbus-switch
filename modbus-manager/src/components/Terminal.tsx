import { FunctionComponent, useEffect, useState } from 'react';

type Props = {};

const readFromPort = (reader: ReadableStreamDefaultReader<Uint8Array>, onRead: (data: Uint8Array) => void) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    // Allow the serial port to be closed later.
                    reader.releaseLock();
                    resolve();
                    break;
                }
                // value is a Uint8Array.
                onRead(value);
            }
        } catch (error) {
            reject(error);
        }
    });
};

const ui8ToHexStr = (ui8: Uint8Array) => {
    return Array.from(ui8).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

const hexStrToUi8 = (hexStr: string) => {
    return new Uint8Array(hexStr.split(' ').map(b => parseInt(b, 16)));
}

export const Terminal: FunctionComponent<Props> = () => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [output, setOutput] = useState("");
  const appendOutput = (data: string) => setOutput(cur => cur + '\n' +  data);

  useEffect(() => {

  }, []);

  useEffect(() => {
        if (!port) {
            return;
        }
        if (!port.readable) {
            return;
        }
      const reader = port.readable.getReader();

      readFromPort(reader, (data) => {
          appendOutput(ui8ToHexStr(data));
      });

  }, [port]);


  const chosenPort = () => {
      navigator.serial.requestPort()
          .then(port => {
              port.open({ baudRate: 9600 })
                  .then(() => {
                      setPort(port)
                  });
          })
  }

  const write = () => {
        if (!port) {
            return;
        }
        if (!port.writable) {
            return;
        }
      const writer = port.writable.getWriter();

    const data = hexStrToUi8("01 03 00 00 00 01 84 0A");
      writer.write(data).then(() => {
            appendOutput("Data sent");
          writer.releaseLock();
      })


// Allow the serial port to be closed later.

  }

  return (
    <div>

      <button onClick={chosenPort}>Choose port</button>
      {port && <pre>{JSON.stringify(port.getInfo(), null, 2)}</pre>}
        <button onClick={write}>Write</button>

        <pre>{output}</pre>

    </div>
  );
};
