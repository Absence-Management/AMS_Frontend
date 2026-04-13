"use client";

import AdminAttendanceTable from "@/components/dashboard/AdminAttendanceTable";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";

const mockAttendances = [
  {
    id: 1,
    first_name: "Yasmine",
    last_name: "Benkhelifa",
    email: "yasmine.benkhelifa@esi-sba.dz",
    student_id: "S23001",
    year: "CP1",
    group: "A1",
    absences: 1,
    status: "safe",
  },
  {
    id: 2,
    first_name: "Amine",
    last_name: "Boudiaf",
    email: "amine.boudiaf@esi-sba.dz",
    student_id: "S23007",
    year: "CP1",
    group: "A2",
    absences: 4,
    status: "safe",
  },
  {
    id: 3,
    first_name: "Nour",
    last_name: "Kaci",
    email: "nour.kaci@esi-sba.dz",
    student_id: "S23014",
    year: "CP2",
    group: "B1",
    absences: 5,
    status: "warning",
  },
  {
    id: 4,
    first_name: "Reda",
    last_name: "Mekki",
    email: "reda.mekki@esi-sba.dz",
    student_id: "S22022",
    year: "CP2",
    group: "B2",
    absences: 6,
    status: "warning",
  },
  {
    id: 5,
    first_name: "Imane",
    last_name: "Sahraoui",
    email: "imane.sahraoui@esi-sba.dz",
    student_id: "S22031",
    year: "CS1",
    group: "C1",
    absences: 2,
    status: "safe",
  },
  {
    id: 6,
    first_name: "Mohamed",
    last_name: "Lounis",
    email: "mohamed.lounis@esi-sba.dz",
    student_id: "S22044",
    year: "CS1",
    group: "C2",
    absences: 8,
    status: "warning",
  },
  {
    id: 7,
    first_name: "Aya",
    last_name: "Brahimi",
    email: "aya.brahimi@esi-sba.dz",
    student_id: "S21003",
    year: "CS2",
    group: "D1",
    absences: 10,
    status: "excluded",
  },
  {
    id: 8,
    first_name: "Zakaria",
    last_name: "Cherif",
    email: "zakaria.cherif@esi-sba.dz",
    student_id: "S21018",
    year: "CS2",
    group: "D2",
    absences: 3,
    status: "safe",
  },
  {
    id: 9,
    first_name: "Lina",
    last_name: "Azzouz",
    email: "lina.azzouz@esi-sba.dz",
    student_id: "S21027",
    year: "CS3",
    group: "E1",
    absences: 11,
    status: "excluded",
  },
  {
    id: 10,
    first_name: "Sofiane",
    last_name: "Touati",
    email: "sofiane.touati@esi-sba.dz",
    student_id: "S20009",
    year: "CS3",
    group: "E2",
    absences: 7,
    status: "warning",
  },
  {
    id: 11,
    first_name: "Meriem",
    last_name: "Belhadj",
    email: "meriem.belhadj@esi-sba.dz",
    student_id: "S20021",
    year: "CS3",
    group: "E2",
    absences: 0,
    status: "safe",
  },
  {
    id: 12,
    first_name: "Anis",
    last_name: "Bensaid",
    email: "anis.bensaid@esi-sba.dz",
    student_id: "S20034",
    year: "CS3",
    group: "E3",
    absences: 9,
    status: "warning",
  },
];

export default function AttendancePage() {
  return (
    <div className="main-page attendance-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Attendance</h2>
          <p className="main-subtitle">View and monitor student absences</p>
        </div>

        <ExportAbsencesButton />
      </div>

      <AdminAttendanceTable attendances={mockAttendances} />
    </div>
  );
}
