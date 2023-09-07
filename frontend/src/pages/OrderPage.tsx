import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CartPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authContext } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authContext.isAuthenticated) {
      navigate("/");
    }
  }, [authContext]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    const target = e.currentTarget;
    console.log(target);
    // const email = target.querySelector("#email").value.trim();
    const fullname = target.querySelector("#fullname")?.value?.trim();
    const phone = target.querySelector("#phone")?.value?.trim();
    const shipping_method = target.querySelector("#shipping")?.value?.trim();
    const payment_method = target.querySelector("#payment")?.value?.trim();

    handleCheckout({
      fullname: fullname,
      // email: email,
      phone: phone,
      shipping_method: shipping_method || "COD",
      payment_method: payment_method || "CASH",
    });
  };

  const handleCheckout = async (info: any) => {
    try {
      await axios.post("/api/orders/" + authContext.user.id + "/create", info);
      toast({
        title: "Created an order successfully!",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
      navigate("/");
    } catch (err: any) {
      console.log(err.response.data);
      const message =
        err.response.data.error || "Can not create order!"
      setErrorMessage(message);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl my-8">
        <div className="w-full bg-white xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 md:text-3xl">
              Delivery Information
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Full name
                </label>
                <Input id="fullname" placeholder="First and last name" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="name@domain.com"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Phone number
                </label>
                <Input id="phone" placeholder="0123456789" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Shipping method
                </label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue id="shipping" placeholder="Shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Shipping method</SelectLabel>
                      <SelectItem value="COD">COD</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Payment method
                </label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue id="payment" placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Payment method</SelectLabel>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="BANK">Banking</SelectItem>
                      <SelectItem value="CREDIT">Credit card</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {errorMessage ? (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {errorMessage}
                </div>
              ) : null}
              <div className="flex justify-between mt-4">
                <Button
                  className="text-base py-6"
                  variant={"outline"}
                  onClick={() => navigate("/cart")}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  <span className="ml-4">Back to Cart</span>
                </Button>
                <Button type="submit" className="text-base py-6 px-8">
                  Checkout
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
