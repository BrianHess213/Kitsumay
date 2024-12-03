import { NextAuthOptions, SessionStrategy } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { XataAdapter } from '@next-auth/xata-adapter';
import { XataClient } from '@/src/xata';

const client = new XataClient();

export const authOptions: NextAuthOptions = {
    adapter: XataAdapter(client),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    secret: process.env.NEXTAUTH_SECRET,
};



