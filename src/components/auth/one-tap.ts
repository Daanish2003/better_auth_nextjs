import { authClient } from "@/lib/auth-client";

export const oneTapCall = async () => {
  try {
    await authClient.oneTap({
      callbackURL: '/',
      cancelOnTapOutside: true,
      context: "signin",
      autoSelect: true,
    });
  } catch {}
};
