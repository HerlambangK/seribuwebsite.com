export const NavMenuAdmin = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Orders", link: "/orders" },
  { title: "Users", link: "/users" },
  { title: "Settings", link: "/settings" },
  {
    title: "Examples",
    children: [
      { title: "Cards", link: "/examples/cards" },
      { title: "Dashboard", link: "/examples/dashboard" },
    ],
  },
  {
    title: "External Projects",
    children: [
      { title: "Project 1", link: "https://example.com/project1" },
      { title: "Project 2", link: "https://example.com/project2" },
      { title: "Logout", action: "logout" },
    ],
  },
  { title: "Logout", action: "logout" },
];
