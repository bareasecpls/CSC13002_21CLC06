import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";


export default function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const submitHandler = (e: any) => {
    e.preventDefault();
    const target = e.currentTarget;
    console.log(target);
    const email = target.querySelector("#email").value.trim();
    const username = target.querySelector("#username").value.trim();
    const password = target.querySelector("#password").value.trim();
    const repassword = target.querySelector("#re-password").value.trim();
    const phone = target.querySelector("#password").value.trim();
    const fullname = target.querySelector("#password").value.trim();

    handleRegister({username: username, email: email, password: password, re_password: repassword, phone: phone, fullname: fullname});
  };

  const handleRegister = async (info: any) => {
    try {
      await axios.post("/api/register/", info);
      toast({
        title: "Created account successfully!",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
      navigate("/login");
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
      <Toaster />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Full name
                </label>
                <Input id="fullname" placeholder="First and last name"/>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Username
                </label>
                <Input id="username" placeholder="Username" required/>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Email
                </label>
                <Input type="email" id="email" placeholder="name@domain.com" required/>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Phone number
                </label>
                <Input id="phone" placeholder="0123456789"/>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Password
                </label>
                <Input type="password" id="password" placeholder="••••••••" required/>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Confirm password
                </label>
                <Input
                  type="password"
                  id="re-password"
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
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
