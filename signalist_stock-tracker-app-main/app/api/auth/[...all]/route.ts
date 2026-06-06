import { getAuth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = async (req: Request) => {
    const auth = await getAuth();
    return toNextJsHandler(auth)(req);
};

export { handler as GET, handler as POST };