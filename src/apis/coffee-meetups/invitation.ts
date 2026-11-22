export const invitationTemplates = [
  "envelope",
  "postcard",
  "ticket",
  "notebook",
  "menu",
  "picnic",
  "film",
  "ribbon",
  "stars",
  "latte",
  "matchbox",
  "pressed-flower",
  "receipt",
  "window",
  "checkers",
] as const;
export const invitationColors = ["caramel", "rose", "matcha", "blue", "cocoa"] as const;

export function getInvitationDesign(template?: string | null, color?: string | null) {
  return {
    template: invitationTemplates.find((item) => item === template) ?? invitationTemplates[0],
    color: invitationColors.find((item) => item === color) ?? invitationColors[0],
  };
}

export type InvitationStyle = ReturnType<typeof getInvitationDesign>;
