import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";


const { handlers: { GET, POST } } = NextAuth(authOptions);

export { GET, POST };