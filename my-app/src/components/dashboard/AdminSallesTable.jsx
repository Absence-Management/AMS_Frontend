"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// AdminSallesTable.jsx
// ============================================

import DataTable from "@/components/shared/DataTable";
import { IconDots } from "@/components/shared/TableShared";
import useDashboardTable from "@/hooks/useDashboardTable";

const COLUMNS = ["Type", "Name", "Department", "Capacity", "Action"];
const PAGE_SIZE = 7;

function TypeBadge({ type }) {
  const isAmphi = type?.toLowerCase().includes("amphi");
  return (
    <span
      className={`admin-salles-table__type-badge ${
        isAmphi
          ? "admin-salles-table__type-badge--amphi"
          : "admin-salles-table__type-badge--room"
      }`}
    >
      {type}
    </span>
  );
}

function SalleRow({ salle, onEditSalle }) {
  const canEdit = Boolean(salle?.id);

  return (
    <div className="admin-data-table__row admin-salles-table__row">
      <div className="admin-data-table__cell">
        <TypeBadge type={salle.type} />
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {salle.name || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {salle.department || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {salle.capacity ?? 0}
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        <button
          type="button"
          className="admin-data-table__action-btn"
          onClick={() => onEditSalle?.(salle)}
          aria-label={`Actions for ${salle.name}`}
          title={canEdit ? "Edit resource" : "Unavailable: missing id"}
          disabled={!canEdit}
        >
          <IconDots />
        </button>
      </div>
    </div>
  );
}

function normalizeSalle(raw, index) {
  return {
    id: raw?.id ?? index,
    name: raw?.name || `Room ${index + 1}`,
    type: raw?.type || "Room",
    department: raw?.department || "Sup",
    capacity: raw?.capacity ?? 0,
  };
}

export default function AdminSallesTable({ salles = [], onEditSalle }) {
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    normalizedItems: normalizedSalles,
    pagedItems: pagedSalles,
    totalCount,
  } = useDashboardTable({
    items: salles,
    normalizeItem: normalizeSalle,
    searchFields: ["name", "type", "department"],
    pageSize: PAGE_SIZE,
  });

  return (
    <DataTable
      title="Total Resources"
      count={normalizedSalles.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search name, type, department..."
      columns={COLUMNS}
      tableClass="admin-salles-table"
      headerClass="admin-data-table__header-row admin-salles-table__header-row"
      footerClass="admin-salles-table__footer"
      emptyMessage="No resources found."
      rowLabel="resources"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
    >
      {pagedSalles.map((salle) => (
        <SalleRow
          key={`${salle.id}-${salle.name}`}
          salle={salle}
          onEditSalle={onEditSalle}
        />
      ))}
    </DataTable>
  );
}
