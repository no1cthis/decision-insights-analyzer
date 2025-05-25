import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateTable: () => queryClient.invalidateQueries({ queryKey: ['user-decisions'] }),
    invalidateDashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard-category-counts'] }),
  };
}