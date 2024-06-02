import './App.css';
import Alert from './components/Alert';
const Data= require('./data/eve.json')

function App() {
  return (
    <div className="App">
      <h1>Event Dashboard</h1>
      <Alert data={Data}/>
    </div>
  );
}

export default App;
