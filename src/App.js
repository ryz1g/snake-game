import './App.css';
import Grid from "./components/Grid";

function App() {
  return (
    <div className="App">
      <Grid rows={10} cols={10} pixels={25}/>
    </div>
  );
}

export default App;
