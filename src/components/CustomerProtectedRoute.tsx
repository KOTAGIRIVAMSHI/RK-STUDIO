import { Navigate, Outlet } from 'react-router-dom'
import { useCustomerAuth } from '../features/auth/CustomerAuthContext'
import { Loader2 } from 'lucide-react'

const CustomerProtectedRoute = () => {
    const { user, loading } = useCustomerAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-studio-neutral">
                <Loader2 className="w-10 h-10 text-studio-gold animate-spin" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default CustomerProtectedRoute
