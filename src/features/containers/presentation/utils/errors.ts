/** Extracts a user-facing message from a caught value, falling back when it isn't an Error */
export function getErrorMessage(err: unknown, fallback: string): string {
    return err instanceof Error ? err.message : fallback;
}
