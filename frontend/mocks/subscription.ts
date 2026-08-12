import { plans } from "./plans";

export const userSubscription = {
  planId: "plus",
  plan: plans.find((p) => p.id === "plus")!,
  startDate: "2025-01-01",
};
