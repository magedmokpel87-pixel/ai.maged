import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "aimagedContent",
  access: (allow) => ({
    "covers/*": [
      allow.guest.to(["read"]),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
    "books/public/*": [
      allow.guest.to(["read"]),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
    "books/private/*": [
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
    "ads/*": [
      allow.guest.to(["read"]),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
  }),
});
