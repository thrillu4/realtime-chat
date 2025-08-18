import { LoaderPinwheel } from 'lucide-react'
import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import SignUp from './pages/SignUp'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
	const { theme } = useThemeStore()
	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	console.log(authUser)

	if (isCheckingAuth && !authUser)
		return (
			<div className='flex items-center justify-center h-screen'>
				<LoaderPinwheel className='animate-spin size-14' />
			</div>
		)

	return (
		<div data-theme={theme}>
			<Navbar />
			<Routes>
				<Route
					path='/'
					element={authUser ? <Home /> : <Navigate to='/login' />}
				/>
				<Route
					path='/signup'
					element={!authUser ? <SignUp /> : <Navigate to='/' />}
				/>
				<Route
					path='/login'
					element={!authUser ? <Login /> : <Navigate to='/' />}
				/>
				<Route
					path='/profile'
					element={authUser ? <Profile /> : <Navigate to='/login' />}
				/>
				<Route path='/settings' element={<Settings />} />
			</Routes>
		</div>
	)
}

export default App
