import { useEffect, useMemo } from "react";
import {
  Stack,
  Group,
  Button,
  Text,
  MultiSelect,
  Alert,
  LoadingOverlay,
} from "@mantine/core";
import { useAuth } from "@/contexts/use-auth";
import { useForm } from "@mantine/form";
import { useAssignUserRoles, useGetUserRoles } from "@/api/user-roles/hooks";
import { useListRoles } from "@/api/role/hooks";
import type { UserRoleFormData } from "@/api/user-roles/types";
import { userRoleFormSchema } from "@/api/user-roles/schema";
import { zod4Resolver } from "mantine-form-zod-resolver";

interface UserRolesModalProps {
  id: string;
}

export function UserRolesModal({ id }: UserRolesModalProps) {
  const { user } = useAuth();

  const { data: userRoles, isLoading: loadingUserRoles } = useGetUserRoles(id);
  const { data: availableRoles = [], isLoading: loadingRoles } = useListRoles();
  const assignRoleMutation = useAssignUserRoles();

  const form = useForm<UserRoleFormData>({
    initialValues: { roleIds: [] },
    validate: zod4Resolver(userRoleFormSchema),
  });

  useEffect(() => {
    form.initialize({ roleIds: userRoles?.roleIds || [] });
  }, [loadingUserRoles]);

  const rolesOptions = useMemo(
    () =>
      availableRoles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
    [loadingRoles]
  );

  const handleSubmit = (data: UserRoleFormData) => {
    if (!user) return;

    assignRoleMutation.mutate({ user, data, id });
  };

  if (!user) return null;
  const isLoading = loadingUserRoles || loadingRoles;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Text size="lg" fw={600}>
          Manage Roles - {user.firstName} {user.lastName}
        </Text>

        {isLoading ? (
          <LoadingOverlay visible={isLoading} />
        ) : (
          <>
            {!form.values.roleIds.length && (
              <Alert color="orange" title="No roles assigned">
                This user currently has no roles assigned. Use the selector
                below to add roles.
              </Alert>
            )}

            <div>
              <Text size="sm" fw={500} mb="xs">
                Select Roles
              </Text>
              <MultiSelect
                placeholder="Choose roles for this user"
                data={rolesOptions}
                {...form.getInputProps("roleIds")}
                searchable
                clearable
              />
            </div>

            <Group mt="md" justify="flex-end">
              <Button
                type="submit"
                variant="filled"
                color="green"
                loading={assignRoleMutation.isPending}
                disabled={assignRoleMutation.isPending}
              >
                Save Changes
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </form>
  );
}
