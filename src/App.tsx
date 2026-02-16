import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

// Eagerly loaded (critical path)
import Index from "./pages/Index";

// Lazy loaded pages
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Tracking = lazy(() => import("./pages/Tracking"));
const Contact = lazy(() => import("./pages/Contact"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Account = lazy(() => import("./pages/Account"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const ReturnsExchanges = lazy(() => import("./pages/ReturnsExchanges"));
const SizeGuide = lazy(() => import("./pages/SizeGuide"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin (lazy loaded)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminPriceUpdate = lazy(() => import("./pages/admin/AdminPriceUpdate"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
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
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
                    <Route path="/size-guide" element={<SizeGuide />} />
                    <Route path="/faq" element={<FAQ />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="pages" element={<AdminPages />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="pricing" element={<AdminPriceUpdate />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
