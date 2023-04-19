import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { signIn, signOut, useSession } from "next-auth/react";
import getLocalStorage from "../utils/getLocalStorage";

function Navigation() {
  const menuItems = [
    {
      name: "Products",
      origin: "Products",
      parent: "",
      link: true,
      level: 0,
      path: "/products",
      id: "i-1",
    },
    {
      name: "Admin",
      origin: "Admin",
      parent: "",
      link: false,
      level: 0,
      id: "i-2",
      children: [
        {
          name: "Settlements",
          origin: "Admin",
          parent: "Admin",
          link: true,
          level: 1,
          id: "i-2-1",
          path: "/settlements",
        },
        {
          name: "Lists",
          origin: "Admin",
          parent: "Admin",
          link: false,
          level: 1,
          id: "i-2-2",
          children: [
            {
              name: "Products",
              origin: "Admin",
              parent: "Lists",
              link: true,
              level: 2,
              id: "i-2-2-1",
              path: "/products",
            },
            {
              name: "Tags",
              origin: "Admin",
              parent: "Lists",
              link: true,
              level: 2,
              id: "i-2-2-2",
              path: "/tags",
            },

            {
              name: "Taggroups",
              origin: "Admin",
              parent: "Lists",
              link: true,
              level: 2,
              id: "i-2-2-3",
              path: "/taggroups",
            },
            {
              name: "Shops",
              origin: "Admin",
              parent: "Lists",
              link: true,
              level: 2,
              id: "i-2-2-4",
              path: "/shops",
            },
            {
              name: "Users",
              origin: "Admin",
              parent: "Lists",
              link: true,
              level: 2,
              id: "i-2-2-5",
              path: "/users",
            },
            {
              name: "Carts",
              origin: "Admin",
              parent: "Lists",
              link: true,
              level: 2,
              id: "i-2-2-6",
              path: "/carts",
            },
            {
              name: "Collective Carts",
              origin: "Admin",
              parent: "Lists",
              link: true,
              level: 2,
              id: "i-2-2-7",
              path: "/collectivecarts",
            },
          ],
        },
        {
          name: "Add",
          origin: "Admin",
          parent: "Admin",
          link: false,
          level: 1,
          id: "i-2-3",
          children: [
            {
              name: "Add Product",
              origin: "Admin",
              parent: "Add",
              link: true,
              level: 2,
              id: "i-2-3-1",
              path: "/products/add",
            },
            {
              name: "Add Shop",
              origin: "Admin",
              parent: "Add",
              link: true,
              level: 2,
              id: "i-2-3-2",
              path: "/shops/add",
            },
            {
              name: "Add User",
              origin: "Admin",
              parent: "Add",
              link: true,
              level: 2,
              id: "i-2-3-3",
              path: "/users/add",
            },
            {
              name: "Add Tag",
              origin: "Admin",
              parent: "Add",
              link: true,
              level: 2,
              id: "i-2-3-4",
              path: "/tags/add",
            },
            {
              name: "Add Taggroup",
              origin: "Admin",
              parent: "Add",
              link: true,
              level: 2,
              id: "i-2-3-5",
              path: "/taggroups/add",
            },
            {
              name: "Uploads",
              origin: "Admin",
              parent: "Add",
              link: true,
              level: 2,
              id: "i-2-3-6",
              path: "/uploads",
            },
          ],
        },
        {
          name: "CSV Upload",
          origin: "Admin",
          parent: "Admin",
          link: true,
          level: 1,
          path: "/data/upload",
          id: "i-2-4",
        },
        {
          name: "CSV Download",
          origin: "Admin",
          parent: "Admin",
          link: true,
          level: 1,
          path: "/data/download",
          id: "i-2-5",
        },
      ],
    },

    {
      name: "User",
      origin: "User",
      parent: "",
      link: false,
      level: 0,
      id: "i-3",
      children: [
        {
          name: "Carts",
          origin: "User",
          parent: "User",
          link: true,
          level: 1,
          id: "i-3-1",
          path: "/carts/list/:uid",
        },
        {
          name: "Wishlist",
          origin: "User",
          parent: "User",
          link: true,
          level: 1,
          id: "i-3-2",
          path: "/wishlist/:uid",
        },
      ],
    },
    // {
    //   name: "Login",
    //   origin: "Login",
    //   parent: "",
    //   link: true,
    //   level: 0,
    //   id: "i-4",
    //   path: "/login",
    // },
    // {
    //   name: "Logout",
    //   origin: "Logout",
    //   parent: "",
    //   link: true,
    //   level: 0,
    //   id: "i-5",
    //   path: "/logout",
    // },
  ];

  // local states
  const { data: session, status } = useSession();

  const [menuItemIsOpen, setMenuItemIsOpen] = useState({
    status: false,
    level: "",
    parent: "",
    name: "",
    origin: "",
  });
  const [navbarIsOpen, setNavbarIsOpen] = useState(false);

  const toggleNavbar = (event) => {
    setNavbarIsOpen(!navbarIsOpen);
  };

  const toggleDropdown = (event, level, parent, name, origin) => {
    // if no item is open yet
    if (menuItemIsOpen.status === false) {
      setMenuItemIsOpen({
        status: true,
        level: level,
        parent: parent,
        name: name,
        origin: origin,
      });
    }
    // if another item is open
    if (menuItemIsOpen.status === true) {
      // clicked on a different branch
      // -> close open item, open clicked item
      if (menuItemIsOpen.origin !== origin) {
        setMenuItemIsOpen({
          status: true,
          level: level,
          parent: parent,
          name: name,
          origin: origin,
        });
      }
      // clicked on the same branch on a deeper level
      // open clicked item, open item stays open
      if (menuItemIsOpen.origin === origin && menuItemIsOpen.level < level) {
        setMenuItemIsOpen({
          status: true,
          level: level,
          parent: parent,
          name: name,
          origin: origin,
        });
      }
      // clicked on the same branch on the highest level (we have only 2 submenu levels)
      // close item
      if (
        menuItemIsOpen.origin === origin &&
        menuItemIsOpen.parent === "" &&
        menuItemIsOpen.name === name
      ) {
        setMenuItemIsOpen({
          status: false,
          level: "",
          parent: "",
          name: "",
          origin: "",
        });
      }
      // clicked on the same branch on the same level
      // -> close open item, open clicked item
      if (
        menuItemIsOpen.origin === origin &&
        menuItemIsOpen.level === level &&
        menuItemIsOpen.name !== name
      ) {
        setMenuItemIsOpen({
          status: true,
          level: level,
          parent: parent,
          name: name,
          origin: origin,
        });
      }
      // clicked on the open item
      // -> close item, open item 1 level up
      if (
        menuItemIsOpen.origin === origin &&
        menuItemIsOpen.level === level &&
        level > 0 &&
        menuItemIsOpen.name === name
      ) {
        setMenuItemIsOpen({
          status: true,
          level: level - 1,
          parent: parent === origin ? "" : origin,
          name: parent,
          origin: origin,
        });
      }
    }
  };

  const populateMenu = (item) => {
    if (!item) return;
    if (item.link) {
      return (
        <li className="nav-item" key={item.id}>
          <Link href={item.path}>
            <a>{item.name}</a>
          </Link>
        </li>
      );
    }
    if (item.children) {
      return (
        <li className="has-dropdown nav-item" key={item.id}>
          <Link href="#" className="navbar-link">
            <a
              onClick={(event) =>
                toggleDropdown(
                  event,
                  item.level,
                  item.parent,
                  item.name,
                  item.origin
                )
              }
            >
              {item.name}
            </a>
          </Link>
          <ul
            className={`navbar-dropdown level-${item.level + 1} ${
              item.name === menuItemIsOpen.name ||
              (item.origin === menuItemIsOpen.origin &&
                item.level < menuItemIsOpen.level)
                ? "is-active"
                : ""
            }`}
          >
            {item.children.map((child) => {
              return populateMenu(child);
            })}
          </ul>
        </li>
      );
    }
  };

  const navList = menuItems.map((item) => populateMenu(item));

  return (
    <>
      <div className="navbar has-background-grey-dark">
        <div className="navbar-brand has-background-grey-dark">
          <Link href="/">
            <a className="navbar-item logo">
              <Image src="/weshop.svg" alt="WeShop" width="103" height="24" />
            </a>
          </Link>
          <div className="navigation-items">
            {!session && (
              <div className="login">
                <Link href="/auth/signin" title="Log in">
                  <a
                    onClick={(event) => {
                      event.preventDefault();
                      signIn();
                    }}
                  >
                    Login
                  </a>
                </Link>
              </div>
            )}

            {session && status !== "loading" && (
              <div className="user">
                {session.user.firstName}/{session.user.role}
              </div>
            )}
            {session && status !== "loading" && (
              <div className="logout">
                <Link href="/api/auth/signout" title="Log out">
                  <a
                    onClick={(event) => {
                      event.preventDefault();
                      signOut();
                    }}
                  >
                    Logout
                  </a>
                </Link>
              </div>
            )}
            <div className="cart-link">
              <Link
                href={`/carts/current`}
                className="button is-normal cart"
                title="View Cart"
              >
                <a>
                  <span className="icon is-normal">
                    <FontAwesomeIcon
                      icon={faShoppingCart}
                      style={{ fontSize: 16 }}
                    />
                  </span>
                </a>
              </Link>
            </div>
            <div
              id="toggler"
              className={`${navbarIsOpen ? "is-active" : ""}`}
              aria-label="menu"
              aria-expanded="false"
              onClick={toggleNavbar}
            >
              <span aria-hidden="true"></span>
            </div>
          </div>
        </div>

        <nav className={`navbar-menu ${navbarIsOpen ? "is-active" : ""}`}>
          <ul>{navList}</ul>
        </nav>
      </div>
    </>
  );
}

export default Navigation;
