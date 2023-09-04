import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <div className="mt-12">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Full name
                </label>
                <Input id="fullname" placeholder="First and last name" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Username
                </label>
                <Input id="username" placeholder="Username" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Email
                </label>
                <Input type="email" id="email" placeholder="name@domain.com" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Phone number
                </label>
                <Input id="phone" placeholder="0123456789" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Password
                </label>
                <Input type="password" id="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Confirm password
                </label>
                <Input
                  type="password"
                  id="re-password"
                  placeholder="••••••••"
                />
              </div>
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
