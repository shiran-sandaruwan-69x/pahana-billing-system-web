import React from 'react';
import PahanManagementRoutes from "./routes/PahanManagementRoutes";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
        <PahanManagementRoutes/>
        <ToastContainer
            progressStyle={{
                transformOrigin: 'right',
                transform: 'scaleX(-1)'
            }}
            autoClose={3000}
            position="top-right"
            style={{ zIndex: 15000 }}
        />
    </div>
  );
}

export default App;
