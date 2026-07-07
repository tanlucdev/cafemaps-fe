import {
  createSubmission,
  type CafeSubmission,
  type CreateSubmissionInput,
} from "@/apis/submissions"

export async function submitCafe(
  data: CreateSubmissionInput,
  token: string
): Promise<CafeSubmission> {
  return createSubmission(data, token)
}
