"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login); // Assuming you have a login action in your store
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Assuming your backend returns a token and possibly user info on successful login
        login(result.token, result.user); // Update your store with token and user info
        router.push("/"); // Redirect to a protected page or dashboard
      } else {
        // Handle login failure (e.g., display error message)
        alert(result.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred during login.");
    }
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
          </button>
        </form>
      </div>
    </div>
  );
}
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const response = await fetch('/api/login', {
      method: 'POST',
 body: JSON.stringify(data),
    });
      const result = await response.json();
      if (result.token) {
        login(result.token, { email: data.email }); // Storing email as a placeholder for user info
        router.push('/'); // Redirect to homepage
      } else {
        alert(result.error || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}