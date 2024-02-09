import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./page/home";
import AdminOperator from "./page/adminOperator";
import Tekshirish from "./page/tekshirish";
import Auth from "./componenta/auth";
import Admin from "./page/admin";

function App() {
  return (
    <div className="App">
      <ToastContainer/>
        <Routes>
            <Route path={"/"} element={ <Home/>}/>
            <Route path={"/tekshirish"} element={ <Tekshirish/>}/>

            <Route path={"/auth/*"} element={ <Auth/>}/>
            <Route path={"/operator/*"} element={ <AdminOperator/>}/>
            <Route path={"/adminAll/*"} element={ <Admin/>}/>

        </Routes>
    </div>
  );
}

export default App;
