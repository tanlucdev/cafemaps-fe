"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import {
  getGoogleOAuthStartApi,
  getMeApi,
  loginApi,
  logoutApi,
  registerApi,
  type LoginPayload,
  type RegisterPayload,
} from "./api"

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
  })
}

export function useGoogleOAuthStartMutation() {
  return useMutation({
    mutationFn: (returnUrl: string) => getGoogleOAuthStartApi(returnUrl),
  })
}

export function useMeQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: false,
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutApi,
  })
}
