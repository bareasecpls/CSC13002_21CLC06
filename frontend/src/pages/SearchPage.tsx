import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import BookCard from "@/components/BookCard";

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookList, setBookList] = useState([]);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get("/api/search");
      console.log("Books: ", data);
      setBookList(data);
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchBooks();
      setLoading(false);
    }, 300);
  }, []);
  return (
    <div>
      {loading && <Spinner />}
      <div>
        {error ? (
          <div className="w-full py-6 text-center">
            <div className="text-3xl font-medium text-gray-500 mt-16">
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="my-8 mx-auto max-w-screen-xl">
              <div className="text-center mb-8 relative">
                <span className="text-3xl px-8 py-2 text-black bg-white border border-gray-300 relative z-10">
                  Search results
                </span>
                <div className="absolute top-1/2 left-0 transform w-full h-[0.06rem] bg-opacity-10 bg-black"></div>
              </div>
            </div>
            <div className="mx-auto max-w-screen-xl">
              {bookList && bookList.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {bookList.map((book: any) => (
                    <div className="mb-3" key={book.id}>
                      <BookCard
                        book_id={book.id}
                        title={book.title}
                        author={book.author}
                        imgUrl={book.image}
                        price={book.price}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center mt-4">
                  <div className="text-4xl font-semibold">
                    There are no books available.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
