export default function InfoRow({ label, value }) {
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(0,0,0,0.4)",
        margin: 0,
      }}
    >
      {label ? `${label} : ` : ""}
      {value || "—"}
    </p>
  );
}
