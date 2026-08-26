import React, { useState } from 'react';
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import HeroStatus from "./components/dashboard/HeroStatus";
import RiskMap from "./components/dashboard/RiskMap";
import KPIStrip from "./components/dashboard/KPIStrip";
import ForecastOutlook from "./components/dashboard/ForecastOutlook";
import AdvisoryCard from "./components/dashboard/AdvisoryCard";
import AdvisoryFeed from "./components/dashboard/AdvisoryFeed";
import DeliveryChannels from "./components/dashboard/DeliveryChannels";

// Import Sidebar pages
import MapPage from "./components/pages/MapPage";
import DataSourcesPage from "./components/pages/DataSourcesPage";
import ModelPage from "./components/pages/ModelPage";
import AdvisoryPage from "./components/pages/AdvisoryPage";
import SettingsPage from "./components/pages/SettingsPage";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <>
            <Topbar />
            {/* HERO ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-[22px] items-stretch">
              <HeroStatus />
              <RiskMap />
            </div>
            
            {/* KPI STRIP */}
            <KPIStrip />
            
            {/* FORECAST & ADVISORY ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-[22px] items-stretch">
              <div className="flex flex-col gap-[22px]">
                <AdvisoryCard />
                <ForecastOutlook />
              </div>
              <div className="flex flex-col gap-[22px]">
                <AdvisoryFeed />
                <DeliveryChannels />
              </div>
            </div>
          </>
        );
      case "map":
        return <MapPage />;
      case "data-sources":
        return <DataSourcesPage />;
      case "model":
        return <ModelPage />;
      case "advisory":
        return <AdvisoryPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      <div className="flex min-h-screen relative z-10">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-1 flex flex-col px-[34px] py-[26px] pb-[60px] gap-[22px] max-w-[1400px] mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </>
  );
}

export default App;
