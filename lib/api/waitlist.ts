import apiClient from "./client";

export interface WaitlistRequest {
  email: string;
}

export interface WaitlistResponse {
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  successful: boolean;
  data: T;
}

export async function subscribeToWaitlist(
  email: string
): Promise<ApiResponse<WaitlistResponse>> {
  const response = await apiClient.post<ApiResponse<WaitlistResponse>>(
    "/api/v1/waitlist/subscribe",
    { email }
  );
  return response.data;
}