// ============================================
// SALES DASHBOARD COMPONENT (MANAGER ONLY)
// ============================================
// View sales data by:
// - Day
// - Week (Week 1, 2, 3, 4 of current month)
// - Month
// Requires manager authorization to access

import { useState, useEffect } from "react";

export default function SalesDashboard({ onClose }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [managerPassword, setManagerPassword] = useState("");
  const [viewMode, setViewMode] = useState("day"); // 'day', 'week', 'month'
  const [selectedWeek, setSelectedWeek] = useState(1); // 1-4
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // AUTHORIZATION CHECK
  // ============================================
  const handleAuthorization = () => {
    if (managerPassword === "admin123") {
      setIsAuthorized(true);
      fetchSalesData("day");
    } else {
      alert("Incorrect manager password!");
      setManagerPassword("");
    }
  };

  // ============================================
  // FETCH SALES DATA FROM BACKEND
  // ============================================
  const fetchSalesData = async (mode, week = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = "http://localhost:5000/api/sales/stats";
      
      if (mode === "day") {
        endpoint = "http://localhost:5000/api/sales/today";
      } else if (mode === "week" && week) {
        endpoint = `http://localhost:5000/api/sales/week?week=${week}`;
      } else if (mode === "month") {
        endpoint = "http://localhost:5000/api/sales/month";
      }
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      
      const data = await response.json();
      setSalesData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE VIEW MODE CHANGE
  // ============================================
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === "week") {
      fetchSalesData("week", selectedWeek);
    } else {
      fetchSalesData(mode);
    }
  };

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
    fetchSalesData("week", week);
  };

  // ============================================
  // RENDER: AUTHORIZATION SCREEN
  // ============================================
  if (!isAuthorized) {
    return (
      <div className="sales-dashboard-overlay">
        <div className="sales-dashboard-modal">
          <div className="dashboard-header">
            <h2>🔒 Manager Authorization Required</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          
          <div className="auth-section">
            <p>Enter manager password to view sales dashboard</p>
            <input
              type="password"
              placeholder="Manager password"
              value={managerPassword}
              onChange={(e) => setManagerPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAuthorization()}
              className="manager-password-input"
              autoFocus
            />
            <button 
              className="authorize-btn"
              onClick={handleAuthorization}
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: SALES DASHBOARD
  // ============================================
  return (
    <div className="sales-dashboard-overlay">
      <div className="sales-dashboard-modal large">
        {/* ============================================ */}
        {/* DASHBOARD HEADER */}
        {/* ============================================ */}
        <div className="dashboard-header">
          <h2>📊 Sales Dashboard</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* ============================================ */}
        {/* VIEW MODE SELECTOR */}
        {/* ============================================ */}
        <div className="view-mode-selector">
          <button
            className={`view-mode-btn ${viewMode === "day" ? "active" : ""}`}
            onClick={() => handleViewModeChange("day")}
          >
            📅 Daily
          </button>
          <button
            className={`view-mode-btn ${viewMode === "week" ? "active" : ""}`}
            onClick={() => handleViewModeChange("week")}
          >
            📆 Weekly
          </button>
          <button
            className={`view-mode-btn ${viewMode === "month" ? "active" : ""}`}
            onClick={() => handleViewModeChange("month")}
          >
            📊 Monthly
          </button>
        </div>

        {/* ============================================ */}
        {/* WEEK SELECTOR (only for weekly view) */}
        {/* ============================================ */}
        {viewMode === "week" && (
          <div className="week-selector">
            <span>Select Week:</span>
            {[1, 2, 3, 4].map((week) => (
              <button
                key={week}
                className={`week-btn ${selectedWeek === week ? "active" : ""}`}
                onClick={() => handleWeekChange(week)}
              >
                Week {week}
              </button>
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* LOADING & ERROR STATES */}
        {/* ============================================ */}
        {loading && (
          <div className="loading-state">
            <p>Loading sales data...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>⚠️ Error: {error}</p>
            <p className="error-hint">Make sure the backend server is running</p>
          </div>
        )}

        {/* ============================================ */}
        {/* SALES DATA DISPLAY */}
        {/* ============================================ */}
        {!loading && !error && salesData && (
          <div className="sales-data-container">
            {/* Daily View */}
            {viewMode === "day" && salesData.date && (
              <div className="sales-summary">
                <h3>Today's Sales - {salesData.date}</h3>
                <div className="sales-cards">
                  <div className="sales-card revenue">
                    <span className="card-label">Total Revenue</span>
                    <span className="card-value">${salesData.revenue?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="sales-card orders">
                    <span className="card-label">Orders</span>
                    <span className="card-value">{salesData.orders || 0}</span>
                  </div>
                  <div className="sales-card average">
                    <span className="card-label">Average Order</span>
                    <span className="card-value">
                      ${salesData.orders > 0 
                        ? (salesData.revenue / salesData.orders).toFixed(2) 
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly View */}
            {viewMode === "week" && salesData.weekData && (
              <div className="sales-summary">
                <h3>Week {selectedWeek} Sales - {salesData.weekData.dateRange}</h3>
                <div className="sales-cards">
                  <div className="sales-card revenue">
                    <span className="card-label">Total Revenue</span>
                    <span className="card-value">${salesData.weekData.revenue?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="sales-card orders">
                    <span className="card-label">Orders</span>
                    <span className="card-value">{salesData.weekData.orders || 0}</span>
                  </div>
                  <div className="sales-card average">
                    <span className="card-label">Average Order</span>
                    <span className="card-value">
                      ${salesData.weekData.orders > 0 
                        ? (salesData.weekData.revenue / salesData.weekData.orders).toFixed(2) 
                        : "0.00"}
                    </span>
                  </div>
                </div>

                {/* Daily Breakdown */}
                {salesData.weekData.dailyBreakdown && salesData.weekData.dailyBreakdown.length > 0 && (
                  <div className="daily-breakdown">
                    <h4>Daily Breakdown</h4>
                    <table className="breakdown-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.weekData.dailyBreakdown.map((day, index) => (
                          <tr key={index}>
                            <td>{day.date}</td>
                            <td>{day.orders}</td>
                            <td>${day.revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Monthly View */}
            {viewMode === "month" && salesData.monthData && (
              <div className="sales-summary">
                <h3>Monthly Sales - {salesData.monthData.month}</h3>
                <div className="sales-cards">
                  <div className="sales-card revenue">
                    <span className="card-label">Total Revenue</span>
                    <span className="card-value">${salesData.monthData.revenue?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="sales-card orders">
                    <span className="card-label">Orders</span>
                    <span className="card-value">{salesData.monthData.orders || 0}</span>
                  </div>
                  <div className="sales-card average">
                    <span className="card-label">Average Order</span>
                    <span className="card-value">
                      ${salesData.monthData.orders > 0 
                        ? (salesData.monthData.revenue / salesData.monthData.orders).toFixed(2) 
                        : "0.00"}
                    </span>
                  </div>
                </div>

                {/* Weekly Summary */}
                {salesData.monthData.weeklyBreakdown && salesData.monthData.weeklyBreakdown.length > 0 && (
                  <div className="daily-breakdown">
                    <h4>Weekly Summary</h4>
                    <table className="breakdown-table">
                      <thead>
                        <tr>
                          <th>Week</th>
                          <th>Orders</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.monthData.weeklyBreakdown.map((week, index) => (
                          <tr key={index}>
                            <td>Week {week.week}</td>
                            <td>{week.orders}</td>
                            <td>${week.revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Popular Items Section */}
            {salesData.popularItems && salesData.popularItems.length > 0 && (
              <div className="popular-items-section">
                <h4>🌟 Top Selling Items</h4>
                <div className="popular-items-list">
                  {salesData.popularItems.slice(0, 5).map((item, index) => (
                    <div key={index} className="popular-item">
                      <span className="item-rank">#{index + 1}</span>
                      <span className="item-name">{item.name}</span>
                      <span className="item-count">{item.timesOrdered} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
