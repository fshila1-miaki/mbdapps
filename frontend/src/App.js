import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AppStore, AppStoreDetail } from "./pages/AppStore";
import Reports from "./pages/Reports";
import Digital from "./pages/Digital";
import AddOns from "./pages/AddOns";
import ApiDocs from "./pages/ApiDocs";
import UserManagement from "./pages/admin/UserManagement";
import AppStoreAdmin from "./pages/admin/AppStoreAdmin";
import TapAdmin from "./pages/admin/TapAdmin";
import MyApps from "./pages/MyApps";
import CmsLayout from "./pages/cms/CmsLayout";
import Overview from "./pages/cms/Overview";
import Products from "./pages/cms/Products";
import Banners from "./pages/cms/Banners";
import Orders from "./pages/cms/Orders";
import Doctors from "./pages/cms/Doctors";
import Appointments from "./pages/cms/Appointments";
import Reviews from "./pages/cms/Reviews";
import Customers from "./pages/cms/Customers";
import Pages from "./pages/cms/Pages";
import MediaLibrary from "./pages/cms/MediaLibrary";
import Settings from "./pages/cms/Settings";
import CmsReports from "./pages/cms/Reports";
import GenericSection from "./pages/cms/GenericSection";
import RobiMart from "./pages/apps/RobiMart";
import DeshiFood from "./pages/apps/DeshiFood";
import EduPath from "./pages/apps/EduPath";
import SathiBD from "./pages/apps/SathiBD";
import QuizBD from "./pages/apps/QuizBD";
import NewsNow from "./pages/apps/NewsNow";
import FitBD from "./pages/apps/FitBD";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<AppStore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Developer */}
          <Route path="/dashboard" element={<ProtectedRoute role="developer"><DeveloperDashboard /></ProtectedRoute>} />
          <Route path="/digital" element={<ProtectedRoute role="developer"><Digital /></ProtectedRoute>} />
          <Route path="/add-ons" element={<ProtectedRoute role="developer"><AddOns /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          {/* My Apps & CMS */}
          <Route path="/my-apps" element={<ProtectedRoute role="developer"><MyApps /></ProtectedRoute>} />
          <Route path="/my-apps/:appId/content" element={<ProtectedRoute role="developer"><CmsLayout /></ProtectedRoute>}>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="menu" element={<Products />} />
            <Route path="banners" element={<Banners />} />
            <Route path="orders" element={<Orders />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="customers" element={<Customers />} />
            <Route path="patients" element={<Customers />} />
            <Route path="pages" element={<Pages />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="reports" element={<CmsReports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="courses" element={<GenericSection sectionParam="courses" />} />
            <Route path="instructors" element={<GenericSection sectionParam="instructors" />} />
            <Route path="properties" element={<GenericSection sectionParam="properties" />} />
            <Route path="agents" element={<GenericSection sectionParam="agents" />} />
            <Route path="leads" element={<GenericSection sectionParam="leads" />} />
            <Route path="packages" element={<GenericSection sectionParam="packages" />} />
            <Route path="destinations" element={<GenericSection sectionParam="destinations" />} />
            <Route path="campaigns" element={<GenericSection sectionParam="campaigns" />} />
            <Route path="team" element={<GenericSection sectionParam="team" />} />
            <Route path="pricing" element={<GenericSection sectionParam="pricing" />} />
            <Route path="students" element={<GenericSection sectionParam="students" />} />
          </Route>

          {/* App Store - public */}
          <Route path="/appstore" element={<AppStore />} />
          <Route path="/appstore/:id" element={<AppStoreDetail />} />
          <Route path="/api-docs" element={<ApiDocs />} />

          {/* Showpiece launched apps */}
          <Route path="/apps/robimart-bd" element={<RobiMart />} />
          <Route path="/apps/deshifood" element={<DeshiFood />} />
          <Route path="/apps/edupath-bd" element={<EduPath />} />
          <Route path="/apps/medilife-clinic" element={<RobiMart />} />
          <Route path="/apps/fitbd" element={<FitBD />} />
          <Route path="/apps/fitbd-web" element={<FitBD />} />
          <Route path="/apps/shoplocal-bd" element={<RobiMart />} />
          <Route path="/apps/sathibd" element={<SathiBD />} />
          <Route path="/apps/sathibd-android" element={<SathiBD />} />
          <Route path="/apps/quizbd" element={<QuizBD />} />
          <Route path="/apps/newsnow" element={<NewsNow />} />
          <Route path="/apps/newsnow-bd" element={<NewsNow />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/appstore" element={<ProtectedRoute role="admin"><AppStoreAdmin /></ProtectedRoute>} />
          <Route path="/admin/tap" element={<ProtectedRoute role="admin"><TapAdmin /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
