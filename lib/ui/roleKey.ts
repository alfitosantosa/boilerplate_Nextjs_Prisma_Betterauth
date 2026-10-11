/**
 * Role name → `menuGroups` key. Extracted from `components/appSidebar.tsx`, which used it
 * as a closure over its own `school` state; the sidebar and the onboarding tour now share
 * this one mapping so the two cannot drift apart.
 *
 * `role` is `user_data.role.name` — free text, hence the `includes` matching.
 * `school` is the selected branch id: an admin/yayasan who picked a branch sees the
 * school-scoped menu set.
 */
export function getRoleMenuKey(role: string, school?: string | null): string {
  const r = role.toLowerCase();

  // Admin School role — always use the schooladministrator menu
  if (r.includes("admin school")) return "schooladministrator";

  // Admin/yayasan that selected a specific school
  if (
    (r.includes("admin") || r.includes("yayasan")) &&
    school &&
    school !== "all"
  ) {
    return "schooladministrator";
  }

  if (r.includes("admin") || r.includes("yayasan")) return "admin";
  if (r.includes("bendahara") || r.includes("treasurer")) return "treasurer";
  if (
    r.includes("teacher") ||
    r.includes("head of school") ||
    r.includes("guru") ||
    r.includes("kepala sekolah")
  ) {
    return "teacher";
  }
  if (r.includes("student") || r.includes("siswa")) return "student";
  if (r.includes("parent") || r.includes("orang tua")) return "parent";

  return "null";
}
