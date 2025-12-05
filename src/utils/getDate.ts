// src/utils/dateRange.ts

export const startOfDay = (dateStr: string): Date => {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
};

export const endOfDay = (dateStr: string): Date => {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
};

export const getDateRange = (
  filterType: string
): { from: Date; to: Date } | null => {
  const now = new Date();
  let from: Date;
  let to: Date;

  switch (filterType) {
    case "today":
      from = startOfDay(now.toISOString());
      to = endOfDay(now.toISOString());
      return { from, to };

    case "week": {
      const day = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
      from = startOfDay(monday.toISOString());
      to = new Date(from);
      to.setDate(to.getDate() + 6);
      to = endOfDay(to.toISOString());
      return { from, to };
    }

    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { from, to };

    default:
      return null;
  }
};
