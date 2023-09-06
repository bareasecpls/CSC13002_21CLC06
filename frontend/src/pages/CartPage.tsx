import { CartItem } from "@/components/CartItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/contexts/AuthContext";

export default function CartPage() {
  const { authContext } = useAuthContext();
  const [itemList, setItemList] = useState([]);

  const fetchBooks = async () => {
    if (!authContext.isAuthenticated) {
      return;
    }
    try {
      const { data } = await axios.get("/api/cart/" + authContext.user.id + "/");
      console.log(data);
      setItemList(data);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRemove = (bookId: number) => {
    console.log(bookId);
  };
  const onQuantityChange = (newQuantity: number, bookID: number) => {
    console.log(newQuantity);
    console.log(bookID);
  };

  return (
    <div className="mx-auto max-w-screen-xl border mt-8">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
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
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item: any) => (
            <CartItem
              userId={authContext.user.id}
              book={item.book}
              quantity={item.quantity}
              onRemove={onRemove}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
