import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import path from "../../utils/path";
import { Header, Sidebar } from "./components";

const Admin = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isHideSideBar, setIsHideSideBar] = useState(true);

    useEffect(() => {
        navigate(`${path.DASHBOARD}`);
    }, []);
    return (
        <div className="flex w-screen h-screen">
            {isHideSideBar && <Sidebar />}
            <div className="flex flex-1 flex-col">
                <Header
                    isHideSideBar={isHideSideBar}
                    setIsHideSideBar={setIsHideSideBar}
                />
                <div className="flex-grow-0 bg-[#F1F5F9] h-[calc(100vh-76px)] w-[calc(100vw -300px)] overflow-x-hidden p-7 overflow-y-auto">
                    <BreadCrumb pathname={pathname} />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Admin;
