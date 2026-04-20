"use client";

import { useMemo, useState, useCallback } from "react";

function toSearchableString(value) {
  return String(value ?? "").toLowerCase();
}

export default function useDashboardTable({
  items = [],
  normalizeItem = (item) => item,
  searchFields = [],
  pageSize = 7,
  enableSearch = true,
  initialPage = 1,
  filterFn = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(initialPage);

  const normalizedItems = useMemo(
    () => items.map((item, index) => normalizeItem(item, index)),
    [items, normalizeItem],
  );

  const filteredItems = useMemo(() => {
    let result = normalizedItems;
    if (filterFn) {
      result = result.filter(filterFn);
    }

    if (!enableSearch) return result;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    if (typeof searchFields === "function") {
      return result.filter((item) => searchFields(item, query));
    }

    if (!Array.isArray(searchFields) || searchFields.length === 0) {
      return result;
    }

    return result.filter((item) => {
      return searchFields.some((field) => {
        return toSearchableString(item && item[field]).includes(query);
      });
    });
  }, [normalizedItems, searchQuery, enableSearch, searchFields, filterFn]);

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const totalCount = filteredItems.length;

  const pagedItems = useMemo(
    () => filteredItems.slice((page - 1) * pageSize, page * pageSize),
    [filteredItems, page, pageSize],
  );

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    page,
    setPage,
    normalizedItems,
    filteredItems,
    pagedItems,
    totalCount,
  };
}
