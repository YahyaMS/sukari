import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("Utils", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      expect(cn("px-2 py-1", "px-3")).toBe("py-1 px-3")
    })

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional", false && "hidden")).toBe("base conditional")
    })

    it("should handle undefined and null values", () => {
      expect(cn("base", undefined, null, "valid")).toBe("base valid")
    })
  })
})
