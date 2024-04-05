"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toggleProductAvailability } from "@adminActions/products";

import { DropdownMenuItem } from "@components/DropdownMenu";

const ActiveToggleDropdownItem: React.FC<{
  id: string;
  available: boolean;
}> = ({ id, available }) => {
  const [isPending, startTransition] = useTransition(),
    router = useRouter();

  return (
    <DropdownMenuItem
      onClick={() =>
        startTransition(async () => {
          const product = await toggleProductAvailability(id, !available);
          if (product) router.refresh();
        })
      }
      disabled={isPending}
    >
      {available ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
};

const DeleteDropdownItem: React.FC<{
  id: string;
  action: (id: string) => Promise<object>;
  disabled?: boolean;
}> = ({ id, action, disabled }) => {
  const [isPending, startTransition] = useTransition(),
    router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() =>
        startTransition(async () => {
          const res = await action(id);
          if (res) router.refresh();
        })
      }
      disabled={disabled || isPending}
    >
      Delete
    </DropdownMenuItem>
  );
};

export { ActiveToggleDropdownItem, DeleteDropdownItem };
