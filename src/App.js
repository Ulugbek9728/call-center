import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./page/home";
import Admin from "./page/admin";
import Tekshirish from "./page/tekshirish";
import Auth from "./componenta/auth";

function App() {
  return (
    <div className="App">
      <ToastContainer/>
        <Routes>
            <Route path={"/"} element={ <Home/>}/>
            <Route path={"/tekshirish"} element={ <Tekshirish/>}/>

            <Route path={"/auth/*"} element={ <Auth/>}/>
            <Route path={"/admin/*"} element={ <Admin/>}/>

        </Routes>
    </div>
  );
}

export default App;
