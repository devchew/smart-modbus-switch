import "xp.css/dist/XP.css";
import { ConnectionProvider } from './hoocks/ConnectionProvider.tsx';
import { DeviceManagerWindow } from './components/DeviceManagerWindow.tsx';


function App() {

  return (
    <>
      <h2>Modbus manager</h2>
        <ConnectionProvider>
            <DeviceManagerWindow/>
        </ConnectionProvider>
    </>
  )
}

export default App
