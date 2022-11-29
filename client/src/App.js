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
import { ShoppingCartProvider } from './context/shoppingCartContext';
import { LanguageContextProvider } from './context/languageContext';

function App() {
  return (

    <Router>
      <div className="App">
        <ShoppingCartProvider>
          <LanguageContextProvider>
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
          </LanguageContextProvider>
        </ShoppingCartProvider>
      </div>
    </Router>
  );
}

export default App;