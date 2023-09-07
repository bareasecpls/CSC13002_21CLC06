import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router";

export default function SearchBox() {
  const navigate = useNavigate();

  const submitHandler = (e: any) => {
    e.preventDefault();
    const query = e.currentTarget.querySelector("#query").value.trim();
    if (!query) {
      console.log(query);
    }
    navigate("/search?q=" + query);
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="flex items-center space-x-2">
        <Input
          id="query"
          type="text"
          className="px-3 py-2 w-[600px]"
          placeholder="Search for books ..."
        />
        <Button type="submit" className="px-4 py-2">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ color: "#ffffff" }}
          />
        </Button>
      </form>
    </div>
  );
}
