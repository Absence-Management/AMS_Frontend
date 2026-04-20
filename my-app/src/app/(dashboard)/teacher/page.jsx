"use client";

import React from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AbsenceBarChart } from "@/components/dashboard/AbsenceBarChart";
import ThresholdAlerts from "@/components/dashboard/ThresholdAlerts";

// ── MOCK DATA ─────────────────────────────────────────────

// Return current day in French with first letter uppercase
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
  const dayIdx = new Date().getDay();
  return daysFr[dayIdx];
}

const MOCK_ALERTS = [
  {
    initials: "BR",
    name: "Bouhafs Rim",
    subject: "Data Structures",
    count: 4,
    limit: 3,
  },
  {
    initials: "KS",
    name: "Khelifi Sara",
    subject: "Algorithms",
    count: 3,
    limit: 3,
  },
  {
    initials: "CM",
    name: "Cherif Malik",
    subject: "Database Systems",
    count: 2,
    limit: 3,
  },
];

const MOCK_MODULE_RATES = [
  { level: "D.Struct", absences: 12 },
  { level: "Algo", absences: 8 },
  { level: "DB Systems", absences: 5 },
  { level: "Op.Sys", absences: 18 },
  { level: "Networks", absences: 7 },
  { level: "Justified", absences: 62 },
];

const TEACHER_STATS = [
  {
    icon: <StatsCard.WarningIcon />,
    iconBg: "#fffbeb",
    label: "threshold reached",
    title: "Students at risk",
    value: 3,
  },
  {
    icon: <StatsCard.AbsenceIcon />,
    iconBg: "#eaf0ff",
    label: "across your modules",
    title: "Avg absence rate",
    value: "8.4%",
  },
];



export default function TeacherDashboardPage() {
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
        {TEACHER_STATS.map((card, i) => (
          <StatsCard key={i} {...card} />
        ))}
      </div>
      {/* 3. Main Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[1.5625rem] mb-8 lg:h-[22.5rem]">
        <div className="lg:col-span-3 h-[22.5rem] lg:h-full">
          <AbsenceBarChart
            data={MOCK_MODULE_RATES}
            year={2026}
            title="Module absence rate — this semester"
          />
        </div>
        <div className="lg:col-span-2 h-[22.5rem] lg:h-full">
          <ThresholdAlerts alerts={MOCK_ALERTS} />
        </div>
      </div>
    </div>
  );
}
