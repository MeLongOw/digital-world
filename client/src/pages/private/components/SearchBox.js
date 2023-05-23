import React from "react";
import icons from "../../../utils/icons";

const { AiOutlineSearch } = icons;
const SearchBox = () => {
    return (
        <div className="border flex bg-white items-center rounded-md px-3">
            <input placeholder="Search..." className="outline-none"/>
            <button><AiOutlineSearch /></button>
        </div>
    );
};

export default SearchBox;
