import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutate } from "@/lib/request";
import { HttpMethod } from "@/lib/request";
import cameraPositionPresetApi from "@/lib/camera/cameraPositionPresetApi";
import { PositionPresetWriteRequest } from "@/lib/camera/types";

interface ReorderItem {
  id: string;
  sort_index: number;
}

interface ReorderMutationOptions<T extends ReorderItem> {
  queryKey: string[];
  updateEndpoint: string;
  updateMethod: HttpMethod;
  getUpdateBody: (item: T) => PositionPresetWriteRequest;
  cameraId: string;
}

export function useReorderMutation<T extends ReorderItem>({
  queryKey,
  updateEndpoint,
  updateMethod,
  getUpdateBody,
  cameraId,
}: ReorderMutationOptions<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      items,
    }: {
      items: { id: string; sort_index: number; item: T }[];
    }) => {
      return mutate(cameraPositionPresetApi.batchRequest, {
        pathParams: { cameraId },
      })({
        requests: items.map(({ id, sort_index, item }, index) => {
          const updateBody = getUpdateBody(item);
          return {
            url: updateEndpoint
              .replace("{cameraId}", cameraId)
              .replace("{presetId}", id),
            method: updateMethod,
            reference_id: `item_${index}`,
            body: {
              ...updateBody,
              sort_index,
            },
          };
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}

// Helper function to handle reordering logic
export function handleReorder<T extends ReorderItem>(
  item: T,
  direction: "up" | "down",
  items: T[]
): { items: Array<{ id: string; sort_index: number; item: T }> } | null {
  const currentIndex = items.findIndex((i) => i.id === item.id);
  if (currentIndex === -1) return null;

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  // Don't proceed if trying to move beyond boundaries
  if (targetIndex < 0 || targetIndex >= items.length) return null;

  const targetItem = items[targetIndex];

  // Swap the sort_index values between the two items
  return {
    items: [
      { id: item.id, sort_index: targetItem.sort_index, item },
      { id: targetItem.id, sort_index: item.sort_index, item: targetItem },
    ],
  };
}
