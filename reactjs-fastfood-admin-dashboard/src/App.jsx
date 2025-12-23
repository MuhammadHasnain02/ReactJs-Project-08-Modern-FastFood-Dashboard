import { Route, Routes } from "react-router-dom";

import DashboardLeftSide from "./components/DashboardLeftSide";
import Home from "./components/Home";

import Navbar from "./components/Navbar";
import LiveOrders from "./components/LiveOrders";
import OrderHistory from "./components/OrderHistory";
import FoodMenu from "./components/FoodMenu";

import Inventory from "./components/Inventory";
import Customers from "./components/Customers";
import OffersPromos from "./components/OffersPromos";

import Analytics from "./components/Analytics";
import TeamStaff from "./components/TeamStaff";
import Setting from "./components/Setting";
import Footer from "./components/Footer";


function App() {

  return (
    <div className="flex flex-col min-h-screen justify-between">

      <div className="ml-60">
        <Navbar />
      </div>
      <DashboardLeftSide />

      <Routes>

        <Route index element={<Home />} />
        <Route path="/liveorders" element={<LiveOrders />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/foodmenu" element={<FoodMenu />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/offers&promos" element={<OffersPromos />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/team&staff" element={<TeamStaff />} />
        <Route path="/setting" element={<Setting />} />

      </Routes>
      
      <Footer />

    </div>
  );
  
}

export default App

// 7. 🏷️ Offers & Promos (fa-tags)
// Managing marketing campaigns and discounts.
// Promotion Table: A list of all active, scheduled, and expired promotions.
// Columns: Code Name, Discount Type (%, Flat $), Start/End Date, Usage Count.
// Creation Form: A comprehensive form for "Create New Promo" where you define conditions (min. order total, applicable items, first-time user only).

// next section is 
// 8. 📈 Analytics (fa-chart-bar)
// Deeper insights for strategic decision-making.
// Detailed Charts:
// Revenue by Category: (Which menu categories are performing best).
// Hourly Sales Heatmap: (Which hours of the day are busiest for staffing).
// Reports: Downloadable CSV/PDF reports for daily, weekly, or monthly sales summaries.

// next section is 
// 9. 💳 Team / Staff (fa-id-card)
// Managing who works and what they can do.
// Staff List Table: A list of all employees.
// Columns: Name, Role (Manager, Cashier, Driver), Permissions.
// Action: "Add New User" form and a section for defining User Roles and Access Levels.