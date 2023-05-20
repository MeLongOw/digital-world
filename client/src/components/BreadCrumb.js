import React from "react";
import { Link } from "react-router-dom";
import { convertSlugToNormal } from "../utils/helpers";
import path from "../utils/path";

const BreadCrumb = ({ pathname }) => {
    const route = pathname.split("/");

    return (
        route[1] && (
            <div className="bg-gray-100 w-full py-4 pl-2">
                <h4 className="text-lg mb-[10px] text-gray-700 uppercase">
                    {convertSlugToNormal(route[route.length - 1])}
                </h4>
                <div className="text-sm text-gray-500 flex">
                    {route.map((item, index) => {
                        if (index === 0) {
                            return (
                                <Link
                                    to={`/${path.HOME}`}
                                    className=" hover:text-main"
                                    key={index}
                                >
                                    <span>HOME</span>
                                </Link>
                            );
                        } else if (index === route.length - 1) {
                            return (
                                <div key={index}>
                                    <span className="mx-2">›</span>
                                    <span className="uppercase">{convertSlugToNormal(item)}</span>
                                </div>
                            );
                        } else {
                            return (
                                <div key={index}>
                                    <span className="mx-2">›</span>
                                    <Link
                                        to={`/${item}`}
                                        className="uppercase hover:text-main"
                                    >
                                        {convertSlugToNormal(item)}
                                    </Link>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        )
    );
};

export default BreadCrumb;
