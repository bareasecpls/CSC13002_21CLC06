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
  quantity: number,
  onRemove: (bookId: number) => void;
  onQuantityChange: (newQuantity: number, bookId: number) => void;
};

export const CartItem = ({
  book,
  quantity,
  onRemove,
  onQuantityChange,
}: CartItemProps) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="w-32 p-4">
        <img src={book.image} alt="Apple Watch" />
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        {book.title}
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        {Number(book.price).toLocaleString("us", {
          style: "currency",
          currency: "USD",
        })}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div>
            <input
              type="number"
              id={`quantity-book-${book.id}`}
              className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-1"
              placeholder={quantity.toString()}
              required
              onChange={(e) =>
                onQuantityChange(Number(e.target.value), book.id)
              }
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        {(Number(book.price) * quantity).toLocaleString("us", {
          style: "currency",
          currency: "USD",
        })}
      </td>
      <td className="px-6 py-4">
        <button
          className="font-medium text-red-600 dark:text-red-500 hover:underline"
          onClick={() => onRemove(book.id)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};
