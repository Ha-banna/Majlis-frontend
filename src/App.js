import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './app/Components/Header/Header';
import Home from './app/Pages/Home/Home';
import Login from './app/Pages/Login/Login';
import Register from './app/Pages/Register/Register';
import CreatePost from './app/Pages/CreatePost/CreatePost';
import UserProfile from './app/Pages/UserProfile/UserProfile';
import { QueryClient, QueryClientProvider } from 'react-query';
import { URL } from './app/settings';

const queryClient = new QueryClient();

window.addEventListener('beforeunload', async()=>{
  try{
    await fetch(`${URL}/users/close`, {method: 'GET'});
  } catch (e){
    throw new Error(e);
  }
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Header></Header>      
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/create' element={<CreatePost></CreatePost>}></Route>
          <Route path='/user-profile' element={<UserProfile></UserProfile>}></Route>
        </Routes>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
