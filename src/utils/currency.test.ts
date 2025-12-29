import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCurrencyFromKobo,
  formatPercentage,
} from "./currency";

describe("Currency Utils", () => {
  describe("formatCurrency", () => {
    it("formats number correctly", () => {
      expect(formatCurrency(1000)).toBe("₦1,000");
    });

    it("handles null", () => {
      expect(formatCurrency(null)).toBe("₦0");
    });
  });

  describe("formatCurrencyFromKobo", () => {
    it("converts kobo to naira", () => {
      expect(formatCurrencyFromKobo(100000)).toBe("₦1,000");
    });

    it("handles null/undefined", () => {
      expect(formatCurrencyFromKobo(null)).toBe("₦0");
      expect(formatCurrencyFromKobo(undefined)).toBe("₦0");
    });
  });

  describe("formatPercentage", () => {
    it("formats percentage correctly", () => {
      expect(formatPercentage(50)).toBe("50%");
    });

    it("handles decimals", () => {
      expect(formatPercentage(12.5)).toBe("12.5%");
    });
  });
});
