import './App.css';
import Home from './components/Home';
import ResponsiveAppBar from './components/Navbar';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import AllBooks from './components/AllBooks';
import BookDetails from './components/BookDetails';
import Checkout from './components/Checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (

    <Router>
      <div className="App">
        <ResponsiveAppBar />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/allbooks' element={<AllBooks />}></Route>
          <Route path='/book/:bookId' element={<BookDetails />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/checkout' element={<Checkout />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;