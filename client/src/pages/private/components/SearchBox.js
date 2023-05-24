import React, { useEffect, useState } from "react";
import icons from "../../../utils/icons";
import Select from "react-select";

const { AiOutlineSearch, AiOutlineLoading } = icons;

const SearchBox = ({ fetch = () => {}, isOption = true, options = [] }) => {
    const [value, setValue] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [field, setField] = useState({ value: "title", label: "Title" });

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (value) {
                fetch({ [field.value]: value });
            } else {
                fetch();
            }
            setIsLoading(false);
        }, 300);
        return () => {
            clearTimeout(timerId);
        };
    }, [value]);
    return (
        <div className="flex">
            <div className="border flex bg-white items-center rounded-md px-3">
                <input
                    placeholder="Search by title..."
                    className="outline-none"
                    onChange={(e) => {
                        setIsLoading(true);
                        setValue(e.target.value);
                    }}
                    value={value}
                />
                <div className="pl-2">
                    {isLoading ? (
                        <AiOutlineLoading className="animate-spin" />
                    ) : (
                        <AiOutlineSearch />
                    )}
                </div>
            </div>
            {isOption && (
                <Select
                    className="border-none"
                    options={options}
                    onChange={setField}
                    value={field}
                />
            )}
        </div>
    );
};

export default SearchBox;
