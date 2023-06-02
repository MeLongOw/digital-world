import React, { useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import icons from "../../../utils/icons";
import path from "../../../utils/path";

const { CgProfile, AiOutlineStar, AiOutlineShoppingCart } = icons;
const sidebar = [
    {
        icon: <CgProfile size={20} />,
        title: "Profile",
        path: `/${path.ACCOUNT_PROFILE}`,
    },
    {
        icon: <AiOutlineShoppingCart size={20} />,
        title: "Orders",
        path: `/${path.ACCOUNT_ORDERS}`,
    },
    {
        icon: <AiOutlineStar size={20} />,
        title: "Ratings",
        path: `/${path.ACCOUNT_RATINGS}`,
    },
];

const Account = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (pathname === `/${path.ACCOUNT}`)
            navigate(`/${path.ACCOUNT_PROFILE}`);
    }, []);
    return (
        <div className="flex mb-10">
            <div className="flex-2 border">
                <div className="h-[48px] bg-main font-semibold text-xl text-white flex items-center justify-center  ">
                    MY ACCOUNT
                </div>
                <div className="p-4 text-lg font-medium text-gray-700">
                    {sidebar.map((item) => (
                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 mb-2 ${
                                    isActive && "text-main"
                                }`
                            }
                        >
                            <span>{item.icon}</span>
                            <span>{item.title}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className="flex-5 border border-l-0 pl-5 pr-[72px] text-gray-700">
                <Outlet />
            </div>
        </div>
    );
};

export default Account;
