export const formatApiValidationError = (err, fallbackMessage) => {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    const readable = detail
      .map((item) => {
        if (typeof item === "string") return item;
        const field = Array.isArray(item?.loc)
          ? item.loc.filter((part) => part !== "body").join(".")
          : "field";
        const message = item?.msg || "Invalid value";
        return `${field}: ${message}`;
      })
      .filter(Boolean);

    if (readable.length > 0) return readable.join(" | ");
  }

  if (typeof detail === "string" && detail.trim()) return detail;

  const message = err?.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message;

  return fallbackMessage;
};
