import api from "@/services/api";

export const groupsService = {
  async getAll(params = {}) {
    const { data } = await api.get("/v1/groups", { params });

    const items = data?.items ?? [];

    // Backend fields:
    // - group_id, year, section, group_name, speciality
    // - student_count, absence_rate
    return items.map((g) => ({
      id: g.group_id,
      year: g.year,
      section: g.section,
      number: g.group_name,
      speciality: g.speciality,
      studentCount: g.student_count,
      absenceRate: g.absence_rate,
      // keep raw fields too (for existing UI that may use them)
      group_id: g.group_id,
      group_name: g.group_name,
      student_count: g.student_count,
      absence_rate: g.absence_rate,
    }));
  },
};
