import './App.css';
import Home from './components/Home';
import ResponsiveAppBar from './components/Navbar';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import AllBooks from './components/AllBooks';
import BookDetails from './components/BookDetails';
import Checkout from './components/Checkout';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (

    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<> <ResponsiveAppBar/> <Home/> </>}></Route>
          <Route path='/allbooks' element={<> <ResponsiveAppBar/> <AllBooks/> </>}></Route>
          <Route path='/book/:bookId'  element={<> <ResponsiveAppBar/> <BookDetails/> </>}></Route>
          <Route path='/profile' element={<> <ResponsiveAppBar/> <Profile/> </>}></Route>
          <Route path='/login' element={<> <ResponsiveAppBar/> <Login/> </>}></Route>
          <Route path='/register' element={<> <ResponsiveAppBar/> <Register/> </>}></Route>
          <Route path='/checkout' element={<> <ResponsiveAppBar/> <Checkout/> </>}></Route>
        </Routes>
      </div>
    </Router>  
  );
}

export default App;