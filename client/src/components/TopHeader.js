import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import path from "../utils/path";

const TopHeader = () => {
    const { isLoggedIn } = useSelector((state) => state.user);

    return (
        <div className="h-[38px] w-full bg-main flex justify-center">
            <div className="w-main flex items-center justify-between text-xs text-white">
                <span>ORDER ONLINE OR CALL US (+84) 906 243 XXX</span>
                {isLoggedIn ? (
                    <span>Welcome to Digital World</span>
                ) : (
                    <Link
                        className="hover:text-gray-800 transition-colors"
                        to={`/${path.LOGIN}`}
                    >
                        Sign In or Create Account
                    </Link>
                )}
            </div>
        </div>
    );
};

export default memo(TopHeader);
