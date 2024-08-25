import "xp.css/dist/XP.css";
import { ConnectionProvider } from './hoocks/ConnectionProvider.tsx';
import { DeviceManagerWindow } from './components/DeviceManagerWindow.tsx';
import './App.css'

function App() {

  return (
    <div className="mainFrame">
        <ConnectionProvider>
            <DeviceManagerWindow/>
        </ConnectionProvider>
    </div>
  )
}

export default App
