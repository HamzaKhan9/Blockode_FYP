export const getInitials = (name: string) => {
  if (!name) return "";

  return name
    .trim()
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
};
