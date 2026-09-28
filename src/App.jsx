import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';

import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Toast from './components/common/Toast.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import CustomerDashboardPage from './pages/CustomerDashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

// Scroll to top upon navigating
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800">
            <ScrollToTop />
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<HomePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/confirmation/:pnr" element={<ConfirmationPage />} />

                {/* Espace Client : Accessible aux voyageurs (client/customer/user) et aux administrateurs */}
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={['client', 'customer', 'user', 'admin']}>
                      <CustomerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/espace-client"
                  element={
                    <ProtectedRoute allowedRoles={['client', 'customer', 'user', 'admin']}>
                      <CustomerDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Espace Back-Office : Strictement réservé au rôle 'admin' */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'administrator']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirection par défaut */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
            <Toast />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}