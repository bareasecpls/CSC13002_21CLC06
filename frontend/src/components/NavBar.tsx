"use client";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChevronDown,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import SearchBox from "./SearchBox";
import { useAuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "./ui/toaster";
import Avatar from "../assets/rose.jpg";

interface Props {
  categories: any[];
}

export default function NavBar({ categories }: Props) {
  const navigate = useNavigate();
  const { authContext, setAuthContext } = useAuthContext();
  const { toast } = useToast();
  console.log(authContext);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout/", {});
      toast({
        title: "You have been logged out!",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
      setAuthContext({ ...authContext, user: {}, isAuthenticated: false });
      localStorage.removeItem("authData");
    } catch (err: any) {
      console.log(err.message);
      toast({
        title: "Failed to log out!",
        action: <ToastAction altText="ok">OK</ToastAction>,
      });
      return;
    }
  };

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
            <div className="flex items-center relative">
              <div className="mr-3 font-semibold">
                {authContext.user?.username}
              </div>
              <div className="rounded-full h-10 w-10">
                <img
                  src={Avatar}
                  alt="user avatar"
                  className="rounded-full h-10 w-10 object-cover"
                />
              </div>
              <div className="dropdown group inline-block relative">
                <button className="text-gray-700 font-semibold px-2 items-center">
                  <FontAwesomeIcon icon={faChevronDown} color="#42464B" />
                </button>
                <ul className="dropdown-menu z-10 group-hover:block absolute hidden border border-gray-200 bg-white right-0">
                  <li className="hover:bg-gray-200 p-1">
                    <Link
                      to="/"
                      className="text-base text-black hover:text-black w-28"
                    >
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="mx-2 text-gray-600"
                      />
                      Details
                    </Link>
                  </li>
                  <li className="hover:bg-gray-200 p-1">
                    <div onClick={handleLogout} className="text-base w-28">
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className="mx-2 text-gray-600"
                      />
                      Log out
                    </div>
                  </li>
                </ul>
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
      <Toaster />
    </>
  );
}
