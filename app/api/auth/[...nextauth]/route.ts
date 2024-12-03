import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";


const handlers = NextAuth(authOptions);

export const GET = handlers.handlers.GET;
export const POST = handlers.handlers.POST;