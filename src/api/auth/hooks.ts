"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getGoogleOAuthStartApi,
  getMeApi,
  forgotPasswordApi,
  loginApi,
  logoutApi,
  registerApi,
  resetPasswordApi,
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
} from "./api";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordApi(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPasswordApi(payload),
  });
}

export function useGoogleOAuthStartMutation() {
  return useMutation({
    mutationFn: (returnUrl: string) => getGoogleOAuthStartApi(returnUrl),
  });
}

export function useMeQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: false,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutApi,
  });
}
