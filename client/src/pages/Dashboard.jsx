import React, { useState, useEffect } from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import PartyHistory from '../components/dashboard/PartyHistory';
import { motion } from 'framer-motion';
import Header from '../components/dashboard/Header';
import { useAuth } from '@clerk/react';
import { roomService } from '../services/roomService';

export default function Dashboard() {
  const premiumEasing = [0.25, 0.1, 0.25, 1];
  const { getToken } = useAuth();
  
  const [data, setData] = useState({ stats: null, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await roomService.getDashboardData(token);
          if (res.success) {
            setData({ stats: res.stats, history: res.history });
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getToken]);

  return (
    <div className="flex-1 flex flex-col w-full relative">
      
      {/* Background graphic (consistent with dark theme) */}
      <div className="absolute inset-0 z-[-20] h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full px-4 py-12 space-y-12">
        
        {/* Header / User Info */}
        <Header />

        {/* Quick Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: premiumEasing }}
        >
          <h2 className="text-xl font-bold text-foreground mb-6">Overview</h2>
          {loading ? (
            <div className="animate-pulse h-32 bg-white/5 rounded-xl"></div>
          ) : (
            <DashboardStats statsData={data.stats} />
          )}
        </motion.section>

        {/* Party History List */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: premiumEasing }}
        >
          {loading ? (
            <div className="animate-pulse h-64 bg-white/5 rounded-xl"></div>
          ) : (
            <PartyHistory historyData={data.history} />
          )}
        </motion.section>

      </div>
    </div>
  );
}
