"use client";

import { SignInForm } from "@/components/auth/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "reactfire";

export const AuthCard = () => {
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin/measurements');
    }
  }, [user, router]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>
          Sign in to access the admin panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
};
