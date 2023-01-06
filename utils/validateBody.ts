// Helper function to ensure body only contains specified properties
// Properties should also only be strings and numbers
// Anything that is invalid should be removed
export function ensureNoInvalidProps<ReturnType extends unknown>(data: Record<string, unknown>, props: string[], requiredProps: string[] = []): Response | ReturnType {
    for (const key in data) {
        if (!props.includes(key)) {
            delete data[key];
            continue;
        }
        if (typeof data[key] !== "string" && typeof data[key] !== "number") {
            delete data[key];
            continue;
        }
    }
    for (const prop of requiredProps) {
        if (!data[prop]) {
            return new Response(`Missing ${prop} in body`, { status: 400 });
        }
    }
    return data as ReturnType;
}