import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { ToastAction } from "./ui/toast";
import { useToast } from "./ui/use-toast";


interface BookCardProps {
  bookId: number;
  title: string;
  author: string;
  image: string;
  price: string;
}

export default function BookCard({
  bookId,
  title,
  author,
  image,
  price,
}: BookCardProps) {
  const { authContext } = useAuthContext();
  const { toast } = useToast();

  const submitAddToCart = () => {
    handleAddToCart();
  };

  const handleAddToCart = async () => {
    if (!authContext.isAuthenticated) {
      toast({
        title: "You need to login first!",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
      return;
    }
    const userId = authContext.user.id;
    try {
      await axios.post("/api/cart/"+userId+"/add", {
        book_id: bookId,
        quantity: 1,
      });
      toast({
        title: "Added book to your cart.",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
    } catch (err: any) {
      console.log(err.response.data);
      toast({
        title: "Failed to add book to your cart.",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
    }
  };

  return (
    <Card className="w-[300px] hover:scale-105 hover:shadow-2xl">
      <CardHeader>
        <div className="flex justify-center mb-3">
          <img className="object-cover h-64" src={image} />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Author: <span className="font-bold">{author}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
          ${price}
        </span>
        <div className="flex items-center  mt-2.5 mb-5">
          <FontAwesomeIcon icon={faStar} style={{ color: "#faca15" }} />
          <FontAwesomeIcon icon={faStar} style={{ color: "#faca15" }} />
          <FontAwesomeIcon icon={faStar} style={{ color: "#faca15" }} />
          <FontAwesomeIcon icon={faStar} style={{ color: "#faca15" }} />
          <FontAwesomeIcon
            icon={faStarHalfStroke}
            style={{ color: "#faca15" }}
          />
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
            4.5
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant={"outline"}>Like</Button>
        <Button onClick={submitAddToCart}>Add to cart</Button>
      </CardFooter>
    </Card>
  );
}
