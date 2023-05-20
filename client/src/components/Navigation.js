import React from "react";
import { navigation } from "../utils/constants";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <div className="w-main h-[48px] py-2 border-y  text-sm flex items-center">
            {navigation.map((item) => (
                <NavLink to={item.path} key={item.id} className={({isActive}) => isActive ? 'pr-12 hover:text-main text-main' : 'pr-12 hover:text-main'}>
                    {item.value}
                </NavLink>
            ))}
        </div>
    );
};

export default Navigation;
