import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Rewards from './components/Rewards';
import Campaigns from './components/Campaigns';
import Auctions from './components/Auctions';
import Profile from './components/Profile';
import ReceiptUpload from './components/ReceiptUpload';
import ProductRecommendations from './components/ProductRecommendations';
import Reviews from './components/Reviews';
import Checkout from './components/Checkout';
import CampaignInsights from './components/CampaignInsights';
import CampaignAnalytics from './components/CampaignAnalytics';

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign-insights" element={<CampaignInsights />} />
          <Route path="/campaign-analytics" element={<CampaignAnalytics />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/receipt-upload" element={<ReceiptUpload />} />
          <Route path="/recommendations" element={<ProductRecommendations />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;