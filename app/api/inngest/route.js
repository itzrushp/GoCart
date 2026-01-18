import { serve } from "inngest/next";
import { inngest } from "./client";
import {
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
} from "./functions";

export const runtime = "nodejs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
  ],
});
