import "xp.css/dist/XP.css";
import { Terminal } from "./components/Terminal"
import { ConnectionProvider } from './hoocks/ConnectionProvider.tsx';


function App() {

  return (
    <>
      <h1>Modbus manager</h1>
        <ConnectionProvider>
            <Terminal />
        </ConnectionProvider>
    </>
  )
}

export default App
