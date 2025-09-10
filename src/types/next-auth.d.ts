import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      loginId: string;
      name: string;
      email?: string | null;
      image?: string | null;
      role: 'USER' | 'ADMIN';
    };
  }

  interface User {
    id: string;
    loginId: string;
    name: string;
    email: string;
    image?: string | null;
    role: 'USER' | 'ADMIN';
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    loginId: string;
    role: 'USER' | 'ADMIN';
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    loginId: string;
    role: 'USER' | 'ADMIN';
    isActive: boolean;
  }
}
