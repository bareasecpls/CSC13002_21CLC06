import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";

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
    // const email = target.querySelector("#email").value.trim();
    const recipient = target.querySelector("#recipient")?.value?.trim();
    const phone = target.querySelector("#phone")?.value?.trim();
    const address = target.querySelector("#address")?.value?.trim();
    const shipping_method = target.querySelector("#shipping")?.value?.trim();
    const payment_method = target.querySelector("#payment")?.value?.trim();

    handleCheckout({
      recipient_name: recipient,
      // email: email,
      phone: phone,
      address: address,
      shipping_method: shipping_method || "NORMAL",
      payment_method: payment_method || "CASH",
    });
  };

  const handleCheckout = async (info: any) => {
    try {
      await axios.post("/api/orders/" + authContext.user.id + "/crate", info);
      toast({
        title: "Created an order successfully!",
        action: (
          <ToastAction altText="ok" onClick={() => navigate("/")}>
            OK
          </ToastAction>
        ),
      });
    } catch (err: any) {
      console.log(err.response.data);
      const message = err.response.data.error || "Can not create order!";
      setErrorMessage(message);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-screen-lg my-8">
        <div className="w-full bg-white xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 md:text-3xl">
              Delivery Information
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Recipient name
                </label>
                <Input
                  id="recipient"
                  placeholder="Recipient full name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
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
                  <Input id="phone" placeholder="0123456789" required />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Delivery address
                </label>
                <Input
                  id="address"
                  placeholder="Number, street, city, province"
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Shipping option
                  </label>
                  <select
                    id="shipping"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                    required
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="INSTANT">Instant</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Payment method
                  </label>
                  <select
                    id="payment"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                  >
                    <option className="p-4" value="CASH">
                      Cash on Delivery
                    </option>
                    <option value="BANK">Bank Transfer</option>
                    <option value="CREDIT">Credit Card</option>
                  </select>
                </div>
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
