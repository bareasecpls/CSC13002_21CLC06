import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

interface Props {
  categories: any[];
}

export default function NavBar({ categories }: Props) {
  const navigate = useNavigate();
  const { authContext, setAuthContext } = useAuthContext();
  
  const handleLogout = () => {
    setAuthContext({...authContext, user: {}, isAuthenticated: false});
  }

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl py-4">
          <a href="/" className="flex items-center">
            <FontAwesomeIcon
              icon={faBook}
              size="xl"
              style={{ color: "#16a34a" }}
            />
            <span className="self-center text-2xl font-bold text-zinc-700 ml-1">
              Bookly
            </span>
          </a>
          <SearchBox />
          {authContext.isAuthenticated ? (
            <div className="flex items-center">
              <div>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div>
                <Button
                  variant="secondary"
                  className="mr-4"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Sign up
                </Button>
              </div>
            </div>
            // null
          )}
        </div>
      </nav>
      <div className="">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <Link to={"/"}>Home</Link>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Categories</MenubarTrigger>
            {categories && categories.length > 0 ? (
              <MenubarContent>
                {categories.map((category) => (
                  <>
                    <MenubarItem key={category.id}>{category.name}</MenubarItem>
                    <MenubarSeparator />
                  </>
                ))}
              </MenubarContent>
            ) : null}
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Featured</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Arrivals</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>
    </>
  );
}
