import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { RegisterInput, User } from '@/types';
import { loadJSON, removeKey, saveJSON, STORAGE_KEYS } from '@/utils/storage';
import { pickAvatarColor, uid } from '@/utils/format';

/** 本地存储的用户记录（含演示用密码散列） */
interface StoredUser extends User {
  passwordHash: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'bio' | 'avatarColor'>>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * 演示用散列：仅用于在本地校验密码，绝非安全实现。
 * 真实系统必须在后端使用 bcrypt / argon2 等慢哈希 + 盐。
 */
function hashPassword(pw: string): string {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) >>> 0;
  return `h${h.toString(16)}`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    loadJSON<User | null>(STORAGE_KEYS.auth, null),
  );

  const login = useCallback(async (email: string, password: string) => {
    await delay(450); // 模拟网络请求
    const users = loadJSON<StoredUser[]>(STORAGE_KEYS.users, []);
    const target = users.find((u) => u.email === normalizeEmail(email));
    if (!target || target.passwordHash !== hashPassword(password)) {
      throw new Error('邮箱或密码不正确');
    }
    const { passwordHash: _omit, ...safe } = target;
    void _omit;
    setUser(safe);
    saveJSON(STORAGE_KEYS.auth, safe);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    await delay(600);
    const email = normalizeEmail(input.email);
    if (!email || !input.password || !input.name.trim()) {
      throw new Error('请完整填写姓名、邮箱与密码');
    }
    if (input.password.length < 6) {
      throw new Error('密码至少 6 位');
    }
    const users = loadJSON<StoredUser[]>(STORAGE_KEYS.users, []);
    if (users.some((u) => u.email === email)) {
      throw new Error('该邮箱已注册，请直接登录');
    }
    const newUser: StoredUser = {
      id: uid('u'),
      name: input.name.trim(),
      email,
      avatarColor: pickAvatarColor(email),
      bio: '',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(input.password),
    };
    saveJSON(STORAGE_KEYS.users, [...users, newUser]);
    const { passwordHash: _omit, ...safe } = newUser;
    void _omit;
    setUser(safe);
    saveJSON(STORAGE_KEYS.auth, safe);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeKey(STORAGE_KEYS.auth);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, 'name' | 'bio' | 'avatarColor'>>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        // 同步更新用户表与登录态
        const users = loadJSON<StoredUser[]>(STORAGE_KEYS.users, []).map((u) =>
          u.id === next.id ? { ...u, ...patch } : u,
        );
        saveJSON(STORAGE_KEYS.users, users);
        saveJSON(STORAGE_KEYS.auth, next);
        return next;
      });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}
