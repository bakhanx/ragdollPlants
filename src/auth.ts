import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { AdapterUser } from 'next-auth/adapters';

// OAuth 사용자를 위한 커스텀 PrismaAdapter
function createCustomPrismaAdapter() {
  const baseAdapter = PrismaAdapter(prisma);
  
  return {
    ...baseAdapter,
    async createUser(data: Partial<AdapterUser>) {
      // OAuth 사용자인 경우 loginId와 name 자동 생성
      if (!data.loginId && data.email) {
        const emailPrefix = data.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        const timestamp = Date.now().toString().slice(-6);
        data.loginId = `${emailPrefix}_${timestamp}`;
        
        // unique name
        if (data.name) {
          const timestamp6 = Date.now().toString().slice(-6); 
          data.name = `${data.name}_${timestamp6}`;
        }
      }
      
      // 기본 createUser 호출
      return baseAdapter.createUser!(data as AdapterUser);
    }
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: createCustomPrismaAdapter(),
  providers: [
    // OAuth 제공자들
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    }),
    // 이메일/비밀번호 로그인
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string
            }
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            loginId: user.loginId,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            isActive: user.isActive
          };
        } catch (error) {
          console.error('인증 오류:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.loginId = user.loginId;
        token.role = user.role || 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.loginId = token.loginId as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      return session;
    },
    async signIn({ user, account }) {
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, isActive: true, password: true }
        });

        if (dbUser && !dbUser.isActive) {
          return false;
        }

        // OAuth 로그인 시 기존 계정이 있고 비밀번호가 설정되어 있으면
        if (account && account.type === 'oauth' && dbUser && dbUser.password) {
          // 이미 OAuth Account가 연결되어 있는지 확인
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: dbUser.id,
              provider: account.provider
            }
          });

          // OAuth Account가 없으면 에러 던지기 (기존 계정 존재)
          if (!existingAccount) {
            throw new Error('DUPLICATE_ACCOUNT');
          }
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 로그아웃 후 리다이렉트 처리
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
});
