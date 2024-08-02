import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
    <ToastContainer 
      position="top-center" 
      autoClose={3000} 
      hideProgressBar={true} 
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      style={{ margin: '0' }} 
    />
  </Provider>
);
