import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SearchBox() {

  // const function submitSearch(params:type) {
    
  // }

  return (
    <form action="/search" className="flex items-center space-x-2">
      <Input type="text" className="px-3 py-2 w-[600px]" placeholder="Search for books ..." />
      <Button className="px-4 py-2"><FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff",}} /></Button>
    </form>
  );
}
