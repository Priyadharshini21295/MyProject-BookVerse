
import { createContext, useEffect, useState } from 'react'
import './App.css'
import { HomePage } from './components/HomePage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { ViewBooksPage } from './components/ViewBooksPage';
import { AddBook } from './components/AddBook';
import { EditBook } from './components/EditBook';
import { AllBooksUser } from './components/AllBooksUser';
import { BookDetailsPage } from './components/BookDetailsPage';
import { CartProvider } from './components/CartProvider';
import { CartPage } from './components/CartPage';
import { RequireRole } from './components/RequireRole';
import { AdminUsers } from './components/AdminUsers';
import { AdminOrders } from './components/AdminOrders';

export const MyContext = createContext();

function App() {

  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  )

  return (
    <>
      
      
      <MyContext.Provider value={{loggedUser, setLoggedUser}}>
        <CartProvider>

           <Router>           

            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage />} />
            
              <Route path='/admin' element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} >
                <Route index element={<ViewBooksPage />} />
                <Route path='view-books' element={<ViewBooksPage />} />
                <Route path='add-book' element={<AddBook />} />
                <Route path='edit-book/:id' element={<EditBook />} />
                <Route path='users' element={<AdminUsers />} />
                <Route path='orders' element={<AdminOrders />} />
              </Route>
              
              <Route path='/user' element={<RequireRole role="user"><UserDashboard /></RequireRole>} >
                  <Route index element={<AllBooksUser />} />
                  <Route path='user-books' element={<AllBooksUser />} />
                  <Route path='view/:id' element={<BookDetailsPage />} />

                  <Route path='cart' element={<CartPage />} />
              </Route>

            </Routes>
        </Router>
        </CartProvider>
       
      </MyContext.Provider>
    </>
  )
}

export default App