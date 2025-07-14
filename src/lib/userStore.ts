import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name?: string;
  provider?: string;
  totpSecret?: string;
  resetToken?: string;
}

async function loadUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find((u) => u.email === email);
}

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find((u) => u.id === id);
}

export async function findUserByResetToken(
  token: string
): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find((u) => u.resetToken === token);
}

export async function createUser(user: User): Promise<void> {
  const users = await loadUsers();
  users.push(user);
  await saveUsers(users);
}

export async function updateUser(user: User): Promise<void> {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    await saveUsers(users);
  }
}
