import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { WalletPage } from './pages/WalletPage'
import { RewardsPage } from './pages/RewardsPage'
import { ScanPage } from './pages/ScanPage'
import { ProfilePage } from './pages/ProfilePage'
import { BottomNav } from './components/BottomNav'
import { useAuthStore } from './store/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/wallet" /> : <LoginPage />} 
          />
          <Route 
            path="/wallet" 
            element={isAuthenticated ? <WalletPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/rewards" 
            element={isAuthenticated ? <RewardsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/scan" 
            element={isAuthenticated ? <ScanPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        {isAuthenticated && <BottomNav />}
      </div>
    </BrowserRouter>
  )
}

export default App
