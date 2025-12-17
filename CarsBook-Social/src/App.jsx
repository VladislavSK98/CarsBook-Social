import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

import UserProvider from './providers/UserProvider'

import Header from './components/Header/Header';
import Home from './components/home/Home';
import Login from './components/login/Login'
import Register from './components/register/Register';
import Logout from './components/logout/Logout';
import AuthGuard from './components/guards/AuthGuard';
import styles from './App.module.css';
import GuestGuard from './components/guards/GuestGuard';
import { ToastContainer } from 'react-toastify';
import MyGarage from './components/Garage/Garage';
import CarDetails from './components/CarDetails/CarDetails';
import CarEdit from './components/Car-Edit/CarEdit';
import Parking from './components/Parking/Parking'; 
import Tracks from './components/Tracks/Tracks';
import TrackDetails from "./components/Tracks/TrackDetails";
import PostDetails from './components/PostDetails/PostDetails';
import Footer from './components/Footer/Footer';



const Admin = lazy(() => import('./components/admin/Admin'));

function App() {
    return (
        <UserProvider>
            <div className={styles.app}>

                <Header />

                <main id="main-content">
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/parking" element={<Parking />} />
                        <Route element={<AuthGuard />}>
                            <Route path="/garage" element={<MyGarage />} />
                            <Route path="/cars/:carId" element={<CarDetails />} />
                            <Route path="/cars/edit/:carId" element={<CarEdit />} />
                            <Route path="/tracks" element={<Tracks/>} />
                            <Route path="/tracks/:id" element={<TrackDetails />} />
                            <Route path="/posts/:postId" element={<PostDetails />} />
                         
                            <Route path="/logout" element={<Logout />} />
                        </Route>
                        <Route element={<GuestGuard />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                        <Route path="/admin" element={(
                            <Suspense fallback={<p>Loading...</p>}>
                                <Admin />
                            </Suspense>
                        )} />
                    </Routes>
                </main>

                <ToastContainer />
            </div>
            <Footer />
        </UserProvider>
    )
}

export default App
