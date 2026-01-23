import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Tracking from "./pages/Tracking";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

// Admin
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
