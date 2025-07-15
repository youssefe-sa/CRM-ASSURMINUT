import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User, LoginData } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginData) => {
      const response = await apiRequest("POST", "/api/login", loginData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/me"], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error?.message,
    isLoginLoading: loginMutation.isPending,
  };
}
