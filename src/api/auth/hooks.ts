"use client"

import { useMutation } from "@tanstack/react-query"
import {
  loginApi,
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
