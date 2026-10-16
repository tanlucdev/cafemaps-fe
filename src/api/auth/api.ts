import apiClient from "../axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUserResponse;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  token?: string;
  user?: AuthUserResponse;
  message?: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  displayName: string | null;
  role: string;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface GoogleOAuthStartResponse {
  authorizationUrl: string;
}

export interface ForgotPasswordPayload {
  email: string;
  locale: "vi" | "en";
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthMessageResponse {
  message: string;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", payload);
  return data;
}

export async function getGoogleOAuthStartApi(returnUrl: string): Promise<GoogleOAuthStartResponse> {
  const { data } = await apiClient.get<GoogleOAuthStartResponse>("/auth/oauth/google/start", {
    params: { returnUrl },
  });
  return data;
}

export async function getMeApi(): Promise<AuthUserResponse | null> {
  const { data } = await apiClient.get<AuthUserResponse | null>("/auth/me");
  return data;
}

export async function logoutApi(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function forgotPasswordApi(
  payload: ForgotPasswordPayload,
): Promise<AuthMessageResponse> {
  const { data } = await apiClient.post<AuthMessageResponse>("/auth/forgot-password", payload);
  return data;
}

export async function resetPasswordApi(
  payload: ResetPasswordPayload,
): Promise<AuthMessageResponse> {
  const { data } = await apiClient.post<AuthMessageResponse>("/auth/reset-password", payload);
  return data;
}
