import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import TermsConditions from "./components/pages/TermsConditions";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import RefundPolicy from "./components/pages/RefundPolicy";
import ShippingPolicy from "./components/pages/ShippingPolicy";
import ContactUs from "./components/pages/ContactUs";
import ServicesProducts from "./components/pages/ServicesProducts";
import Home from "./components/pages/Home";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />

        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/services-products" element={<ServicesProducts />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
