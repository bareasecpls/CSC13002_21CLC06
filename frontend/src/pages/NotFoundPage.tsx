export default function NotFoundPage() {
  return (
    <div>
      <div className="w-full mt-16 py-6 text-center">
        <div className="font-bold text-black text-9xl mb-8">404</div>
        <div className="text-2xl mb-4 font-bold text-center text-gray-800 md:text-3xl">
          <span className="text-xred">Oops!</span> Page not found
        </div>
        <p className="mb-12 text-center text-gray-500 md:text-lg">
          {"The page you’re looking for doesn’t exist."}
        </p>
        <a
          href="/"
          className="font-semibold text-xl border rounded-md py-2 px-8 bg-green-600 hover:bg-[#00a838] text-white"
        >
          Go back
        </a>
      </div>
    </div>
  );
}
