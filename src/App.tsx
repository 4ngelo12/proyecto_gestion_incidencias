import './App.scss'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from './routes/PrivateRoute';
import Login from './components/login/Login';
import { registerLicense } from '@syncfusion/ej2-base';
import AppWrapper from './components/sidebar/AppWrapper';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWGFCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9fcXZURWVcU0FwVkI=');


function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/*" element={<AppWrapper />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

