import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Post from './Post';
import Signup from './Signup';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResetPassword from './ResetPassword';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/posts' element={<Post />} />
        <Route path='/' element={<Signup />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/reset-password' element={<ResetPassword></ResetPassword>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
