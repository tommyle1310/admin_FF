export type sideBarItem = {
  title: string;
  link?: string;
  dropdownItem?: sideBarItem[];
};
export const sideBarItems: sideBarItem[] = [
  {
    title: "Dashboard",
    link: "/",
  },
  {
    title: "Drivers Statistics",
    link: "/drivers",
  },
  {
    title: "Restaurant Owner Statistics",
    link: "/restaurant-owners",
  },
  {
    title: "Customers Statistics",
    link: "/customers",
  },
  {
    title: "Customer Care Team",
    dropdownItem: [
      {
        title: "Customer Care Statistics",
        link: "/cc",
      },
      {
        title: "Customer Care Reports",
        link: "/cc/reports",
      },
    ],
  },
  {
    title: "App Managers",
    dropdownItem: [
      {
        title: "Manage Service fee",
        link: "/manage/service-fee",
      },
      {
        title: "Mange Notifications",
        link: "/manage/notifications",
      },
      {
        title: "Mange FAQs",
        link: "/manage/faqs",
      },
    ],
  },
];
