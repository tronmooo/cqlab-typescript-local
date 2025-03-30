import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFlows, getFlowById, createFlow, updateFlow, deleteFlow } from './apiService';

// Hook for fetching all flows
export const useFlows = () => {
  return useQuery({
    queryKey: ['flows'],
    queryFn: getFlows,
  });
};

// Hook for fetching a single flow by ID
export const useFlow = (id: string) => {
  return useQuery({
    queryKey: ['flow', id],
    queryFn: () => getFlowById(id),
    enabled: !!id, // Only run if id exists
  });
};

// Hook for creating a new flow
export const useCreateFlow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFlow,
    onSuccess: () => {
      // Invalidate and refetch the flows list after a successful create
      queryClient.invalidateQueries({ queryKey: ['flows'] });
    },
  });
};

// Hook for updating a flow
export const useUpdateFlow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFlow(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific flow and the flows list
      queryClient.invalidateQueries({ queryKey: ['flow', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['flows'] });
    },
  });
};

// Hook for deleting a flow
export const useDeleteFlow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteFlow,
    onSuccess: () => {
      // Invalidate and refetch the flows list
      queryClient.invalidateQueries({ queryKey: ['flows'] });
    },
  });
}; 