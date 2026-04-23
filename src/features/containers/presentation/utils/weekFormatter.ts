// Created by Luis

/** Calculates the Monday and Sunday of the week that contains the given date. */
export function getWeekBounds(date: Date): { start: string; end: string } {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
        start: monday.toISOString().slice(0, 10),
        end: sunday.toISOString().slice(0, 10),
    };
}

/** Formats a week range for display, e.g. "Mon Apr 13 – Sun Apr 19, 2026" */
export function formatWeekRange(start: string, end: string): string {
    // Append noon time to avoid UTC offset issues when parsing YYYY-MM-DD
    const s = new Date(`${start}T12:00:00`);
    const e = new Date(`${end}T12:00:00`);

    const fmt = (d: Date) =>
        d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return `${fmt(s)} – ${fmt(e)}, ${e.getFullYear()}`;
}

/** Formats a single date string for compact display, e.g. "Apr 15" */
export function formatShortDate(dateStr: string): string {
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Returns today's date as YYYY-MM-DD */
export function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}
