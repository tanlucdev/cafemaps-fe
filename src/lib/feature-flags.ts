export const featureFlags = {
  coffeeMeetupsEnabled:
    process.env.NEXT_PUBLIC_COFFEE_MEETUPS_ENABLED === "true" ||
    process.env.COFFEE_MEETUPS_ENABLED === "true",
} as const;
