export function formatDate(date) {
  return new Date(date).toLocaleString();
}

export function getRoleRedirect(role) {
  if (role === "admin") return "/admin/users";
  if (role === "enseignant") return "/dashboard";
  return "/login";
}