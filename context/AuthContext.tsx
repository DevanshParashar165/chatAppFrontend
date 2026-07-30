import { createContext, useEffect, useState, useRef, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const backendURL = (import.meta as any).env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendURL;

export interface User {
  _id: string;
  email: string;
  fullname: string;
  profilePic?: string;
  bio?: string;
  lastSeen?: string | Date;
  role?: "user" | "admin";
  blockedUsers?: string[];
}

export interface AuthContextType {
  axios: AxiosInstance;
  authUser: User | null;
  onlineUser: string[];
  lastSeenMap: Record<string, string>;
  socket: Socket | null;
  login: (state: "signup" | "login", credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (body: { fullname: string; bio: string; profilePic?: string | null }) => Promise<void>;
  loading: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUser, setOnlineUser] = useState<string[]>([]);
  const [lastSeenMap, setLastSeenMap] = useState<Record<string, string>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isRefreshing = useRef<boolean>(false);

  const [theme, setTheme] = useState<"light" | "dark">((localStorage.getItem("theme") as "light" | "dark") || "dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    let urlToken = params.get("token");
    let urlRefreshToken = params.get("refreshToken");
    let urlState = params.get("state");

    // Try parsing hash parameters (#) for enhanced security
    if (!urlToken || !urlRefreshToken) {
      const hash = window.location.hash.substring(1);
      params = new URLSearchParams(hash);
      urlToken = params.get("token");
      urlRefreshToken = params.get("refreshToken");
      urlState = params.get("state");
    }

    if (urlToken && urlRefreshToken) {
      const savedState = localStorage.getItem("oauth_state");
      localStorage.removeItem("oauth_state"); // Always consume

      if (urlState && savedState && urlState !== savedState) {
        console.error("OAuth CSRF protection triggered: state mismatch!");
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.href = "/login?error=OAuthStateMismatch";
        return;
      }

      localStorage.setItem("token", urlToken);
      localStorage.setItem("refreshToken", urlRefreshToken);
      setToken(urlToken);
      setRefreshToken(urlRefreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const persistTokens = (accessToken: string, newRefreshToken: string) => {
    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    axios.defaults.headers.common["token"] = accessToken;
  };

  const clearTokens = () => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["token"];
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.data);
        connectSocket(data.data);
      }
    } catch {
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (state: "signup" | "login", credentials: any) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      const { user, token: accessToken, refreshToken: newRefreshToken } =
        data.data;

      if (data.success) {
        setAuthUser(user);
        connectSocket(user);
        persistTokens(accessToken, newRefreshToken);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await axios.post("/api/auth/logout", { refreshToken });
      }
    } catch {
      // proceed with local logout even if server call fails
    }
    clearTokens();
    setAuthUser(null);
    setOnlineUser([]);
    socket?.disconnect();
    toast.success("Logged Out successfully");
  };

  const updateProfile = async (body: { fullname: string; bio: string; profilePic?: string | null }) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.data?.updatedUser || data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const connectSocket = (userData: User) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendURL, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUser(userIds);
    });

    newSocket.on("userLastSeen", ({ userId, lastSeen }: { userId: string; lastSeen: string }) => {
      setLastSeenMap((prev) => ({ ...prev, [userId]: lastSeen }));
    });
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;
        if (
          error.response?.status !== 401 ||
          original._retry ||
          original.url?.includes("/api/auth/login") ||
          original.url?.includes("/api/auth/signup") ||
          original.url?.includes("/api/auth/refresh")
        ) {
          return Promise.reject(error);
        }

        const storedRefresh = localStorage.getItem("refreshToken");
        if (!storedRefresh || isRefreshing.current) {
          clearTokens();
          setAuthUser(null);
          return Promise.reject(error);
        }

        original._retry = true;
        isRefreshing.current = true;

        try {
          const { data } = await axios.post("/api/auth/refresh", {
            refreshToken: storedRefresh,
          });

          if (data.success) {
            const { token: newToken, refreshToken: newRefresh } = data.data;
            persistTokens(newToken, newRefresh);
            original.headers.token = newToken;
            isRefreshing.current = false;
            return axios(original);
          }
        } catch {
          clearTokens();
          setAuthUser(null);
        }

        isRefreshing.current = false;
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    if (!token) {
      setAuthUser(null);
      setLoading(false);
      return;
    }
    axios.defaults.headers.common["token"] = token;
    checkAuth();
  }, [token]);

  const value: AuthContextType = {
    axios,
    authUser,
    onlineUser,
    lastSeenMap,
    socket,
    login,
    logout,
    updateProfile,
    loading,
    theme,
    toggleTheme,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
