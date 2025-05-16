"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
 const router = useRouter();
  const login = useAuthStore((state) => state.login); // Assuming you have a login action in your store
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { toast } = useToast();

  const loginUser = async (data: LoginFormData) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  };

  const { mutate, status } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.token, data.user); // Update your store with token and user info
      router.push("/"); // Redirect to a protected page or dashboard
 },
    onError: (error: any) => {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    },
  }); // Added closing brace here

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f0f0" }}>
      <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
 <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>Email:</label>
            <input
              type="email"
              id="email"
              {...register("email")}
              style={{ width: "100%", padding: "10px", border: `1px solid ${errors.email ? 'red' : '#ccc'}`, borderRadius: "4px" }}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email.message}</p>}
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>Password:</label>
            <input
              type="password"
              id="password"
              {...register("password")}
              style={{ width: "100%", padding: "10px", border: `1px solid ${errors.password ? 'red' : '#ccc'}`, borderRadius: "4px" }}
            />
            {errors.password && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.password.message}</p>}
          </div>
          <button

            disabled={status === 'pending'}
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
 >
            Login
 {status === 'pending' && '...'}
 </button>
        </form>
      </div>
    </div>
  )
};
