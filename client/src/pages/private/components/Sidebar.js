import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo.png";
import icons from "../../../utils/icons";
import path from "../../../utils/path";

const {
    RxDashboard,
    RiProductHuntLine,
    AiOutlineShoppingCart,
    HiOutlineClipboardDocumentCheck,
    AiOutlineStar,
    RiCoupon2Line,
    SiBrandfolder,
    RxAvatar,
} = icons;
const sidebarItem = [
    { icon: <RxDashboard />, title: "Dasboard", path: `/${path.DASHBOARD}` },
    {
        icon: <RiProductHuntLine />,
        title: "Products",
        path: `/${path.PRODUCTS_ADMIN}`,
    },
    {
        icon: <SiBrandfolder />,
        title: "Brands",
        path: `/${path.BRANDS}`,
    },

    {
        icon: <AiOutlineShoppingCart />,
        title: "Categories",
        path: `/${path.CATEGOGIES}`,
    },
    {
        icon: <RxAvatar />,
        title: "Users",
        path: `/${path.USERS}`,
    },
    {
        icon: <HiOutlineClipboardDocumentCheck />,
        title: "Orders",
        path: `/${path.ORDERS}`,
    },
    { icon: <AiOutlineStar />, title: "Reviews", path: `/${path.REVIEWS}` },
    { icon: <RiCoupon2Line />, title: "Coupons", path: `/${path.COUPONS}` },
];
const Sidebar = () => {
    return (
        <div className="flex-shrink-0 w-[300px] border-r">
            <Link to="/" className="flex border-b p-5 h-[76px]">
                <img src={logo} alt="" className="w-full object-contain" />
            </Link>
            <div className="p-5">
                {sidebarItem?.map((item, index) => (
                    <NavLink
                        to={item.path}
                        key={index}
                        className={({ isActive }) =>
                            isActive
                                ? "flex h-[44px] items-center font-medium hover:bg-gray-200 rounded-md mb-2 hover:cursor-pointer text-main"
                                : "flex h-[44px] items-center font-medium hover:bg-gray-200 rounded-md mb-2 hover:cursor-pointer"
                        }
                    >
                        <span className="pr-2">{item.icon}</span>
                        <span>{item.title}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
