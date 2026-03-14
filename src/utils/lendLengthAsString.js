export default function lendLengthAsString(lentDate) {
  if (!lentDate) return 0;
  const today = new Date();
  const start = new Date(lentDate);
  const daysElapsed = (today - start) / (1000 * 60 * 60 * 24);
  const days = Math.floor(daysElapsed);

  if (daysElapsed < 1) return "today.";
  if (days === 1) return "for 1 day.";
  if (daysElapsed < 7) return `for ${days} days.`;
  if (daysElapsed < 14) return "for 1 week.";
  if (daysElapsed < 28) return `for ${Math.floor(daysElapsed / 7)} weeks.`;

  const years = Math.floor(daysElapsed / 365);
  const months = Math.floor((daysElapsed % 365) / 30);
  const weeks = Math.floor(((daysElapsed % 365) % 30) / 7);

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  if (weeks > 0 && years === 0)
    parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
  if (parts.length === 0) parts.push("1 month");

  return `for ${parts.join(", ")}.`;
}
