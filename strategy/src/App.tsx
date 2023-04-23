import "./App.css";
import "./common/components/Canvas";
import Canvas from "./common/components/Canvas";

function App() {
    return (
        <div className="App">
            <Canvas width={window.innerWidth} height={window.innerHeight} />
        </div>
    );
}

export default App;
