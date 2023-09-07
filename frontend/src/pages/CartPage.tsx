import { CartItem } from "@/components/CartItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function CartPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authContext } = useAuthContext();
  const [itemList, setItemList] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  if (!authContext.isAuthenticated) {
    navigate("/");
  }

  const fetchBooks = async () => {
    if (!authContext.isAuthenticated) {
      return;
    }
    try {
      const { data } = await axios.get(
        "/api/cart/" + authContext.user.id + "/"
      );
      setItemList(data);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [authContext]);

  useEffect(() => {
    const sum = itemList.reduce((accSum: number, item: any) => {
      return accSum + Number(item.book.price) * item.quantity;
    }, 0);
    setSubtotal(sum);
  }, [itemList]);

  const onRemove = async (userId: number, bookId: number) => {
    try {
      await axios.delete("/api/cart/" + userId + "/delete/" + bookId);
      setItemList(itemList.filter((item: any) => item.book.id !== bookId));
      toast({
        title: `Removed book #${bookId} from your cart.`,
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Failed to remove book from cart.",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
    }
  };
  const onQuantityChange = async (
    userId: number,
    bookId: number,
    newQuantity: number
  ) => {
    try {
      const { data } = await axios.put("/api/cart/" + userId + "/update", {
        book_id: bookId,
        quantity: newQuantity,
      });
      console.log(data);
      const newItemList: any = itemList.map((obj: any) => {
        if (obj.book.id === bookId) {
          return { ...obj, quantity: newQuantity };
        }
        return obj;
      });
      setItemList(newItemList);
      toast({
        title: `Updated book #${bookId} in your cart.`,
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Failed to update book in your cart.",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
    }
  };

  return (
    <>
      <div className="my-11 mx-auto max-w-screen-xl">
        <div className="text-center mb-8 relative">
          <span className="text-3xl px-8 py-2 text-black bg-white border border-gray-300 relative z-10">
            Shopping Cart
          </span>
          <div className="absolute top-1/2 left-0 transform w-full h-[0.06rem] bg-opacity-10 bg-black"></div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl my-8">
        <table className="w-full text-sm text-gray-600 border">
          <thead className="text-xs text-white uppercase bg-[#16a34a]">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Book
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
              <th scope="col" className="px-6 py-3">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {authContext.user?.id ? (
              <>
                {itemList.map((item: any) => (
                  <CartItem
                    key={item.book.id}
                    userId={authContext.user.id}
                    book={item.book}
                    quantity={item.quantity}
                    onRemove={onRemove}
                    onQuantityChange={onQuantityChange}
                  />
                ))}
              </>
            ) : null}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <Button
            className="text-base py-6"
            variant={"outline"}
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            <span className="ml-4">Continue Shopping</span>
          </Button>
          <div className="row mt-sm-3">
            <div className="col-md-5 min-w-[350px] ml-auto px-0">
              <div className="text-2xl font-semibold pl-6 my-4">Summary</div>
              <table className="w-full border">
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-lg">Subtotal:</td>
                    <td className="px-6 py-4 font-semibold text-lg text-gray-900">
                      {subtotal.toLocaleString("us", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-lg">
                      Shipping fee:
                    </td>
                    <td className="px-6 py-4 font-semibold text-lg text-gray-900">
                      $5
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="font-medium">
                      <input
                        className="py-4 px-6 max-w-[200px]"
                        type="text"
                        placeholder="Enter Coupon code"
                      />
                    </td>
                    <td className="font-semibold bg-black flex items-center justify-center">
                      <button className="text-white p-4">Apply</button>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-xl">
                      Grand total:
                    </td>
                    <td className="px-6 py-4 font-semibold text-lg text-red-500">
                      {(subtotal + 5).toLocaleString("us", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="my-4">
                <Button
                  className="w-full text-base py-6"
                  onClick={() => navigate("/order")}
                >
                  Confirm and order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
