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

/** Returns the ISO 8601 week number (1–53) for the given date. */
export function getISOWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

/** Returns the ISO 8601 year for the given date (may differ from calendar year near year boundaries). */
export function getISOWeekYear(date: Date): number {
    const d = new Date(date);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return d.getFullYear();
}

/** Returns the Monday (as a Date) of ISO week `week` in `year`. */
export function getMondayOfISOWeek(year: number, week: number): Date {
    // Jan 4 is always in week 1 per ISO 8601
    const jan4 = new Date(year, 0, 4);
    const dow = jan4.getDay() || 7; // 1=Mon … 7=Sun
    const week1Monday = new Date(jan4);
    week1Monday.setDate(jan4.getDate() - dow + 1);
    const result = new Date(week1Monday);
    result.setDate(week1Monday.getDate() + (week - 1) * 7);
    return result;
}

/** Returns the total number of ISO weeks in a given year (52 or 53). */
export function isoWeeksInYear(year: number): number {
    const dec28 = new Date(year, 11, 28);
    return getISOWeekNumber(dec28);
}
