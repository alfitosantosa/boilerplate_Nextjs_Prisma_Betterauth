"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/types";
import { apiPost } from "@/lib/http/apiClient";

export default function OnboardingForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: defaultName ? `${defaultName}'s Workspace` : "",
    email: defaultEmail,
    phone: "",
    address: "",
  });

  const update = (patch: Partial<typeof form>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Nama client minimal 2 karakter.");
      return;
    }

    setIsSaving(true);
    try {
      await apiPost("/api/clients", form);
      toast.success("Client berhasil dibuat.");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Buat client</CardTitle>
        <CardDescription>
          Satu akun memiliki satu client. Data role, branch, dan user akan
          berada di bawah client ini.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nama client</Label>
            <Input
              id="client-name"
              value={form.name}
              onChange={(event) => update({ name: event.target.value })}
              placeholder="PT Contoh Indonesia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              value={form.email}
              onChange={(event) => update({ email: event.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-phone">Telepon</Label>
            <Input
              id="client-phone"
              value={form.phone}
              onChange={(event) => update({ phone: event.target.value })}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-address">Alamat</Label>
            <Textarea
              id="client-address"
              value={form.address}
              onChange={(event) => update({ address: event.target.value })}
              placeholder="Alamat opsional"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Membuat client..." : "Buat client"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
