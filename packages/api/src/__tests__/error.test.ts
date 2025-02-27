import { RequestTimeoutError } from "../error";
import { describe, it, expect, vi } from "vitest";

describe("RequestTimeoutError", () => {
  describe("constructor", () => {
    it("should create an instance with the correct name and message", () => {
      const errorMessage = "Test timeout message";
      const error = new RequestTimeoutError(errorMessage);

      expect(error.name).toBe("RequestTimeoutError");
      expect(error.message).toBe(errorMessage);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("rejectAfterTimeout", () => {
    it("should resolve when the promise resolves before timeout", async () => {
      const expectedValue = "success";
      const promise = Promise.resolve(expectedValue);

      const result = await RequestTimeoutError.rejectAfterTimeout(promise, 100);

      expect(result).toBe(expectedValue);
    });

    it("should reject with RequestTimeoutError when timeout occurs", async () => {
      // Create a promise that won't resolve until after the timeout
      const promise = new Promise((resolve) => setTimeout(() => resolve("too late"), 200));

      await expect(RequestTimeoutError.rejectAfterTimeout(promise, 50)).rejects.toThrow(RequestTimeoutError);

      await expect(RequestTimeoutError.rejectAfterTimeout(promise, 50)).rejects.toMatchObject({
        name: "RequestTimeoutError",
        message: "Request timed out after 50ms",
      });
    });

    it("should reject with original error when promise rejects before timeout", async () => {
      const originalError = new Error("Original error");
      const promise = Promise.reject(originalError);

      await expect(RequestTimeoutError.rejectAfterTimeout(promise, 100)).rejects.toBe(originalError);
    });

    it("should clear the timeout when promise resolves", async () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

      const promise = Promise.resolve("success");
      const resultPromise = RequestTimeoutError.rejectAfterTimeout(promise, 1000);

      await resultPromise;

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
      vi.useRealTimers();
    });

    it("should clear the timeout when promise rejects", async () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

      const promise = Promise.reject(new Error("Test error"));
      const resultPromise = RequestTimeoutError.rejectAfterTimeout(promise, 1000);

      await expect(resultPromise).rejects.toThrow("Test error");

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
      vi.useRealTimers();
    });
  });
});
