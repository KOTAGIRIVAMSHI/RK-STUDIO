import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = () => {
    const { session, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
                <Loader2 className="w-10 h-10 text-studio-gold animate-spin" />
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/admin/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
