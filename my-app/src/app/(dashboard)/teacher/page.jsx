"use client";

import React, { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AbsenceBarChart } from "@/components/dashboard/AbsenceBarChart";
import ThresholdAlerts from "@/components/dashboard/ThresholdAlerts";
import { dashboardService } from "@/services/dashboardService";

// ── Helpers ───────────────────────────────────────────────

function getCurrentDay() {
  const daysFr = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return daysFr[new Date().getDay()];
}

// ── Page ──────────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const CURRENT_YEAR = new Date().getFullYear();

  // ── Stats cards ─────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getTeacherStats()
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Failed to load teacher stats:", err);
        setStats(null);
      })
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Module absence rates (bar chart) ─────────────────────
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [moduleRates, setModuleRates] = useState([]);
  const [moduleRatesLoading, setModuleRatesLoading] = useState(true);

  useEffect(() => {
    setModuleRatesLoading(true);
    dashboardService
      .getTeacherModuleRates(selectedYear)
      .then((res) => setModuleRates(res.data ?? []))
      .catch((err) => {
        console.error("Failed to load module rates:", err);
        setModuleRates([]);
      })
      .finally(() => setModuleRatesLoading(false));
  }, [selectedYear]);

  // ── Threshold alerts ─────────────────────────────────
  const [alerts, setAlerts] = useState([]);
  const [alertsTotal, setAlertsTotal] = useState(0);
  const [alertsLoading, setAlertsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getTeacherThresholdAlerts()
      .then((res) => {
        setAlerts(res.alerts ?? []);
        setAlertsTotal(res.total ?? 0);
      })
      .catch((err) => {
        console.error("Failed to load threshold alerts:", err);
        setAlerts([]);
        setAlertsTotal(0);
      })
      .finally(() => setAlertsLoading(false));
  }, []);

  // ── Stat card definitions ────────────────────────────────
  const teacherStatCards = [
    {
      icon: <StatsCard.WarningIcon />,
      iconBg: "#fffbeb",
      label: "threshold reached",
      title: "Students at risk",
      value: statsLoading ? "…" : stats != null ? stats.students_at_risk : "—",
    },
    {
      icon: <StatsCard.AbsenceIcon />,
      iconBg: "#eaf0ff",
      label: "across your modules",
      title: "Avg absence rate",
      value:
        statsLoading
          ? "…"
          : stats != null
          ? `${stats.avg_absence_rate.toFixed(1)}%`
          : "—",
    },
  ];

  return (
    <div className="main-page">
      {/* 1. Page header */}
      <div className="main-header">
        <div className="main-header-text">
          <h1 className="main-title">Dashboard</h1>
          <p className="main-subtitle">
            {getCurrentDay()} — {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 2. KPI row */}
      <div className="stats-cards-grid mb-4">
        {teacherStatCards.map((card, i) => (
          <StatsCard key={i} {...card} />
        ))}
      </div>

      {/* 3. Main Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[1.5625rem] mb-8 lg:h-[22.5rem]">
        <div className="lg:col-span-3 h-[22.5rem] lg:h-full">
          <AbsenceBarChart
            data={moduleRates}
            loading={moduleRatesLoading}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            title="Module absence rate — this semester"
            xKey="module"
            yKey="rate"
            labelKey="label"
            typeKey="type"
          />
        </div>
        <div className="lg:col-span-2 h-[22.5rem] lg:h-full">
          <ThresholdAlerts
            total={alertsTotal}
            alerts={alerts}
            loading={alertsLoading}
          />
        </div>
      </div>
    </div>
  );
}
