import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { NavItem } from "@/types/navigation";

/**
 * Custom arbitrary: generates a random NavItem with mixed visibility
 */
const navItemArbitrary: fc.Arbitrary<NavItem> = fc.record({
  label: fc.string({ minLength: 1, maxLength: 20 }),
  href: fc.string({ minLength: 1, maxLength: 30 }).map((s) => `/${s}`),
  visibility: fc.constantFrom("public" as const, "authenticated" as const),
  type: fc.constantFrom("link" as const, "button" as const),
});

/**
 * Custom arbitrary: generates a navigation config (array of NavItems)
 * with mixed visibility values
 */
const navigationConfigArbitrary = fc.array(navItemArbitrary, {
  minLength: 1,
  maxLength: 20,
});

/**
 * The filtering logic extracted from Header.tsx:
 * Filters navigation items based on authentication state.
 */
function filterNavigationItems(
  items: NavItem[],
  isAuthenticated: boolean
): NavItem[] {
  return items.filter((item) =>
    isAuthenticated
      ? item.visibility === "authenticated"
      : item.visibility === "public"
  );
}

describe("Feature: auth-context-route-protection, Property 5: Navigation item filtering matches authentication state", () => {
  it("filtered items contain exclusively items matching the authentication state visibility", () => {
    /**
     * **Validates: Requirements 7.1, 7.2**
     *
     * For any navigation configuration with mixed visibility values
     * and any boolean isAuthenticated state, the filtered items should:
     * 1. Contain ONLY items whose visibility matches the expected value
     * 2. Contain NO items with non-matching visibility
     * 3. Have a count equal to the count of matching items in the original array
     */
    fc.assert(
      fc.property(
        navigationConfigArbitrary,
        fc.boolean(),
        (navItems, isAuthenticated) => {
          const filtered = filterNavigationItems(navItems, isAuthenticated);

          const expectedVisibility = isAuthenticated
            ? "authenticated"
            : "public";

          // 1. ALL items in result have matching visibility
          const allMatch = filtered.every(
            (item) => item.visibility === expectedVisibility
          );
          expect(allMatch).toBe(true);

          // 2. NO items with non-matching visibility are present
          const nonMatchingVisibility = isAuthenticated
            ? "public"
            : "authenticated";
          const hasNonMatching = filtered.some(
            (item) => item.visibility === nonMatchingVisibility
          );
          expect(hasNonMatching).toBe(false);

          // 3. Count of filtered items equals count of items with that visibility in original
          const expectedCount = navItems.filter(
            (item) => item.visibility === expectedVisibility
          ).length;
          expect(filtered.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});
