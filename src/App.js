import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./page/home";
import Admin from "./page/admin";

function App() {
  return (
    <div className="App">
      <ToastContainer/>
        <Routes>
            <Route path={"/"} element={ <Home/>}/>
            <Route path={"/operatorAdmin/*"} element={ <Admin/>}/>

        </Routes>
    </div>
  );
}

export default App;
