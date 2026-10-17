"use client";

import { useEffect, useState } from "react";

import { useGetBranchs } from "@/hooks/branches/useBranches";
import { useGetRoles } from "@/hooks/roles/useRoles";
import { useGetBetterAuthWithoutUserData } from "@/hooks/users/useBetterAuthWithoutUserData";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/hooks/users/useUsers";
import {
  getErrorMessage,
  type betterauthUser,
  type UserDataTypes,
} from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alertDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type BetterAuthUser = betterauthUser;
export type UserData = UserDataTypes;

type FormState = {
  userId: string;
  name: string;
  email: string;
  roleId: string;
  branchId: string;
  status: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  userId: "",
  name: "",
  email: "",
  roleId: "",
  branchId: "",
  status: "active",
  isActive: true,
};

export function UserFormDialog({
  open,
  onOpenChange,
  editData,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: UserData | null;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const { data: roles = [] } = useGetRoles();
  const { data: branches = [] } = useGetBranchs();
  const { data: availableUsers = [] } = useGetBetterAuthWithoutUserData();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isSaving = createUser.isPending || updateUser.isPending;

  useEffect(() => {
    if (!open) return;

    setForm(
      editData
        ? {
            userId: editData.userId || "",
            name: editData.name || "",
            email: editData.email || "",
            roleId: editData.roleId || "",
            branchId: editData.branchId || "",
            status: editData.status || "active",
            isActive: editData.isActive ?? true,
          }
        : EMPTY_FORM,
    );
  }, [open, editData]);

  const update = (patch: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.roleId) {
      toast.error("Nama dan role wajib diisi.");
      return;
    }
    if (!editData && !form.userId) {
      toast.error("Pilih akun BetterAuth terlebih dahulu.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      roleId: form.roleId,
      branchId: form.branchId || null,
      status: form.status,
      isActive: form.isActive,
    };

    try {
      if (editData) {
        await updateUser.mutateAsync({ id: editData.id, ...payload });
        toast.success("User berhasil diperbarui.");
      } else {
        await createUser.mutateAsync({ userId: form.userId, ...payload });
        toast.success("User berhasil dibuat.");
      }
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit User" : "Tambah User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editData && (
            <div className="space-y-2">
              <Label>Akun BetterAuth</Label>
              <Select
                value={form.userId || "none"}
                onValueChange={(value) => {
                  if (value === "none") return update({ userId: "" });
                  const account = availableUsers.find(
                    (user) => user.id === value,
                  );
                  update({
                    userId: value,
                    name: account?.name || form.name,
                    email: account?.email || form.email,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Pilih akun</SelectItem>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} — {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="user-name">Nama</Label>
            <Input
              id="user-name"
              value={form.name}
              onChange={(event) => update({ name: event.target.value })}
              placeholder="Nama lengkap"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={form.email}
              onChange={(event) => update({ email: event.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.roleId || "none"}
                onValueChange={(value) =>
                  update({ roleId: value === "none" ? "" : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Pilih role</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select
                value={form.branchId || "none"}
                onValueChange={(value) =>
                  update({ branchId: value === "none" ? "" : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanpa branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa branch</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => update({ status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => update({ isActive: event.target.checked })}
              className="accent-primary h-4 w-4"
            />
            Aktif
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  userData,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
  onSuccess: () => void;
}) {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    if (!userData) return;
    try {
      await deleteUser.mutateAsync(userData.id);
      toast.success("User berhasil dihapus.");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus user?</AlertDialogTitle>
          <AlertDialogDescription>
            Data user <strong>{userData?.name}</strong> akan dihapus permanen.
            Akun BetterAuth tetap ada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUser.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteUser.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
