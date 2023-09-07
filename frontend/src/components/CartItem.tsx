import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Book = {
  id: number;
  title: string;
  image: string;
  author: string;
  price: string;
  units_in_stock: number;
  description: string;
  category: number[];
};

type CartItemProps = {
  userId: number;
  book: Book;
  quantity: number;
  onRemove: (userId: number, bookID: number) => void;
  onQuantityChange: (
    userId: number,
    bookID: number,
    newQuantity: number
  ) => void;
};

export const CartItem = ({
  userId,
  book,
  quantity,
  onRemove,
  onQuantityChange,
}: CartItemProps) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-50 text-base">
      <td className="w-32 p-4">
        <div className="flex items-center justify-center">{book.id}</div>
      </td>
      <td className="w-32 p-4">
        <div className="flex items-center justify-center">
          <img src={book.image} alt="Book cover image" />
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900">
        <div className="flex items-center justify-center">{book.title}</div>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900">
        <div className="flex items-center justify-center">
          {Number(book.price).toLocaleString("us", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center space-x-3">
          <div>
            <input
              type="number"
              id={`quantity-book-${book.id}`}
              className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-sm focus:border-blue-500 block px-3 py-1"
              defaultValue={quantity.toString()}
              required
              onChange={(e) =>
                onQuantityChange(userId, book.id, Number(e.target.value))
              }
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        <div className="flex items-center justify-center">
          {(Number(book.price) * quantity).toLocaleString("us", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center">
          <button onClick={() => onRemove(userId, book.id)} className="mx-3">
            <FontAwesomeIcon
              icon={faTrashCan}
              style={{ color: "#ff0000" }}
              size="xl"
            />
          </button>
        </div>
      </td>
    </tr>
  );
};
