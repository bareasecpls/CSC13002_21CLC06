import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "@/contexts/AuthContext";

export default function OrderPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { authContext, setAuthContext } = useAuthContext();

  const submitHandler = (e: any) => {
    e.preventDefault();
    console.log("submitHandler");
    if (authContext.isAuthenticated) {
      setErrorMessage("User is already logged in!");
      return;
    }
    const email = e.currentTarget.querySelector("#email").value.trim();
    const password = e.currentTarget.querySelector("#password").value.trim();
    if (!email) {
      setErrorMessage("Email can not contain white spaces!");
      return;
    }
    if (!password) {
      setErrorMessage("Password can not contain white spaces!");
      return;
    }
    handleLogin(email, password);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await axios.post("/api/login/", {
        email: email,
        password: password,
      });
      setAuthContext({ ...authContext, user: data, isAuthenticated: true });
      navigate("/");
    } catch (err: any) {
      console.log(err.response.data);
      const message =
        err.response.data.error ||
        err.response.data.email[0] ||
        err.response.data.password[0];
      setErrorMessage(message);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Log in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Your email
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@domain.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              {errorMessage ? (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {errorMessage}
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="text-gray-500">Remember me</label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              <p className="text-sm font-light text-gray-500">
                Not registered?{" "}
                <a
                  href="/register"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Create account
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
