import { describe, expect, it } from "vitest";
import { tbsToDdgDf, tbsToSearxngTimeRange } from "./tbs";

describe("tbsToSearxngTimeRange", () => {
	it("maps bare values", () => {
		expect(tbsToSearxngTimeRange("d")).toBe("day");
		expect(tbsToSearxngTimeRange("w")).toBe("week");
		expect(tbsToSearxngTimeRange("m")).toBe("month");
		expect(tbsToSearxngTimeRange("y")).toBe("year");
	});

	it("maps qdr:-prefixed values (the API contract's documented form)", () => {
		expect(tbsToSearxngTimeRange("qdr:d")).toBe("day");
		expect(tbsToSearxngTimeRange("qdr:w")).toBe("week");
		expect(tbsToSearxngTimeRange("qdr:m")).toBe("month");
		expect(tbsToSearxngTimeRange("qdr:y")).toBe("year");
	});

	it("is case- and whitespace-tolerant", () => {
		expect(tbsToSearxngTimeRange(" QDR:W ")).toBe("week");
		expect(tbsToSearxngTimeRange("Qdr:M")).toBe("month");
	});

	it("returns undefined for values without a SearXNG equivalent", () => {
		expect(tbsToSearxngTimeRange("qdr:7d")).toBeUndefined();
		expect(tbsToSearxngTimeRange("qdr:30d")).toBeUndefined();
		expect(tbsToSearxngTimeRange("qdr:h")).toBeUndefined();
		expect(tbsToSearxngTimeRange("7d")).toBeUndefined();
		expect(tbsToSearxngTimeRange("custom:20260101-20260131")).toBeUndefined();
		expect(tbsToSearxngTimeRange(undefined)).toBeUndefined();
		expect(tbsToSearxngTimeRange("")).toBeUndefined();
	});
});

describe("tbsToDdgDf", () => {
	it("passes through bare d/w/m/y", () => {
		expect(tbsToDdgDf("d")).toBe("d");
		expect(tbsToDdgDf("w")).toBe("w");
		expect(tbsToDdgDf("m")).toBe("m");
		expect(tbsToDdgDf("y")).toBe("y");
	});

	it("strips the qdr: prefix", () => {
		expect(tbsToDdgDf("qdr:d")).toBe("d");
		expect(tbsToDdgDf("qdr:w")).toBe("w");
		expect(tbsToDdgDf("qdr:m")).toBe("m");
		expect(tbsToDdgDf("qdr:y")).toBe("y");
	});

	it("passes through custom ranges (contain ..)", () => {
		expect(tbsToDdgDf("2026..2027")).toBe("2026..2027");
	});

	it("returns undefined for unsupported values", () => {
		expect(tbsToDdgDf("qdr:7d")).toBeUndefined();
		expect(tbsToDdgDf("qdr:h")).toBeUndefined();
		expect(tbsToDdgDf(undefined)).toBeUndefined();
		expect(tbsToDdgDf("")).toBeUndefined();
	});
});
