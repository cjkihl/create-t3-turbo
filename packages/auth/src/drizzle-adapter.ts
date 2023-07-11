import { and, eq } from "drizzle-orm";
import {
  type Adapter,
  type AdapterSession,
  type AdapterUser,
} from "next-auth/adapters";

import {
  accounts,
  sessions,
  users,
  verificationTokens,
  type DbClient,
} from "@acme/db";

export const DrizzleAdapter = (client: DbClient): Adapter => {
  return {
    async createUser(user): Promise<AdapterUser> {
      const id = crypto.randomUUID();
      await client.insert(users).values({ ...user, id });
      return { ...user, id };
    },
    async getUser(id) {
      const user =
        (await client
          .select()
          .from(users)
          .where(eq(users.id, id))
          .then((res) => res[0])) ?? null;
      return user;
    },
    async getUserByEmail(email) {
      const user =
        (await client
          .select()
          .from(users)
          .where(eq(users.email, email))
          .then((res) => res[0])) ?? null;
      return user;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const dbAccount = await client
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider),
          ),
        )
        .leftJoin(users, eq(accounts.userId, users.id))
        .then((res) => res[0]);
      return dbAccount?.users ?? null;
    },
    async updateUser(user) {
      if (!user.id) {
        throw new Error("No user id.");
      }
      await client.update(users).set(user).where(eq(users.id, user.id));
      const r = await client
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .then((res) => res[0]);

      if (!r) {
        throw new Error("No user found.");
      }
      return r;
    },
    async deleteUser(userId) {
      await Promise.all([
        client.delete(users).where(eq(users.id, userId)),
        client.delete(sessions).where(eq(sessions.userId, userId)),
        client.delete(accounts).where(eq(accounts.userId, userId)),
      ]);
      return null;
    },
    async linkAccount(account) {
      await client.insert(accounts).values(account);
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider),
          ),
        );
    },
    async createSession(session) {
      await client.insert(sessions).values(session);
      return session;
    },
    async getSessionAndUser(
      sessionToken,
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const sessionAndUser =
        (await client
          .select()
          .from(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .innerJoin(users, eq(users.id, sessions.userId))
          .then((res) => res[0])) ?? null;

      return sessionAndUser
        ? { session: sessionAndUser.sessions, user: sessionAndUser.users }
        : null;
    },
    async updateSession({ sessionToken }) {
      await client
        .update(sessions)
        .set({ sessionToken })
        .where(eq(sessions.sessionToken, sessionToken));

      return client
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .then((res) => res[0]);
    },
    async deleteSession(sessionToken) {
      await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken));
    },
    async createVerificationToken(token) {
      await client.insert(verificationTokens).values(token);
      return token;
    },
    async useVerificationToken({ identifier, token }) {
      try {
        const deletedToken =
          (await client
            .select()
            .from(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, identifier),
                eq(verificationTokens.token, token),
              ),
            )
            .then((res) => res[0])) ?? null;

        await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, identifier),
              eq(verificationTokens.token, token),
            ),
          );

        return deletedToken;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
  };
};
