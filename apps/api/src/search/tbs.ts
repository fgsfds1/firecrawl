/**
 * tbs (time-based search) value mapping.
 *
 * The API contract accepts any string for `tbs` — clients send Google-style
 * values such as "qdr:w" (see the search request schemas), and some send bare
 * "d"/"w"/"m"/"y". Each search backend only supports a subset:
 *
 *   - SearXNG:  time_range = day | week | month | year
 *   - DuckDuckGo (html endpoint): df = d | w | m | y | custom range
 *
 * Values without an equivalent are omitted, so the backend returns
 * unfiltered results. Callers that need to surface that to the user should
 * check the mapping result.
 */

/** Strip the "qdr:" prefix (case-insensitive) and trim. */
function normalizeTbs(tbs: string): string {
	const t = tbs.trim().toLowerCase();
	return t.startsWith("qdr:") ? t.slice(4) : t;
}

/**
 * Map a tbs value to SearXNG's `time_range` parameter.
 * Returns undefined when the value has no SearXNG equivalent
 * (e.g. "qdr:7d", "qdr:h", custom ranges).
 */
export function tbsToSearxngTimeRange(tbs?: string): string | undefined {
	if (!tbs) return undefined;
	switch (normalizeTbs(tbs)) {
		case "d":
			return "day";
		case "w":
			return "week";
		case "m":
			return "month";
		case "y":
			return "year";
		default:
			return undefined;
	}
}

/**
 * Map a tbs value to DuckDuckGo's `df` parameter.
 * Accepts bare "d"/"w"/"m"/"y", the same values with a "qdr:" prefix, and
 * custom ranges (contain ".."). Returns undefined otherwise.
 */
export function tbsToDdgDf(tbs?: string): string | undefined {
	if (!tbs) return undefined;
	const bare = normalizeTbs(tbs);
	if (["d", "w", "m", "y"].includes(bare) || bare.includes("..")) {
		return bare;
	}
	return undefined;
}
