import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import icons from "../utils/icons";
import path from "../utils/path";

const { BsFillSuitHeartFill, AiOutlineShoppingCart, AiOutlineArrowUp } = icons;

const MoveTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const currentUser = useSelector((state) => state.user.current);

    const handleScroll = () => {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        setIsVisible(scrollTop > 100);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            className={`${
                !isVisible && "hidden"
            } fixed right-[20px] bottom-[20px] flex flex-col gap-4`}
        >
            <button
                onClick={scrollToTop}
                className="w-[60px] h-[60px] rounded-full shadow-xl flex items-center justify-center border text-main border-main bg-white"
            >
                <AiOutlineArrowUp size={32} />
            </button>

            <Link
                className="w-[60px] h-[60px] bg-main rounded-full shadow-xl text-white flex items-center justify-center relative"
                onClick={scrollToTop}
                to={`/${path.WISHLIST}`}
            >
                <BsFillSuitHeartFill size={32} />
                <div className="w-[30px] aspect-square border rounded-full border-main bg-white absolute top-[-8px] right-[-8px] text-main text-center font-semibold text-lg">
                    {currentUser?.wishlist?.length || "0"}
                </div>
            </Link>

            <Link
                className="w-[60px] h-[60px] bg-main rounded-full shadow-xl text-white flex items-center justify-center relative"
                onClick={scrollToTop}
                to={`/${path.CART}`}
            >
                <AiOutlineShoppingCart size={32} />
                <div className="w-[30px] aspect-square border rounded-full border-main bg-white absolute top-[-8px] right-[-8px] text-main text-center font-semibold text-lg">
                    {currentUser?.cart?.length || "0"}
                </div>
            </Link>
        </div>
    );
};

export default memo(MoveTopButton);
