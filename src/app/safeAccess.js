export const safeText = (value, fallback = "N/A") =>
    value === null || value === undefined || value === "" ? fallback : value;

export const safeArray = (value) =>
    Array.isArray(value) ? value : [];

export const safeNumber = (value, fallback = 0) =>
    typeof value === "number" ? value : fallback;

export const safeDate = (value, fallback = "N/A") => {
    if (!value) return fallback;
    try {
        return new Date(value).toLocaleDateString("en-GB");
    } catch {
        return fallback;
    }
};
