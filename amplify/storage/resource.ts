import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "socialMediaStorage",
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "private/{identity_id}/*": [
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "avatars/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "posts/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "messages/*": [
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
