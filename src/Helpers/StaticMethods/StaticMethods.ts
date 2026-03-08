export class StaticMethods {
  public static IsNullOrEmpty(
    value: string | any[] | null | undefined,
  ): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }
}
