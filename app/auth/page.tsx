import { AuthCard } from "@/components/auth-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to access the admin panel",
};

export default function AuthPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthCard />
      </div>
    </div>
  );
} 