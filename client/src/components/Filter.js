import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetBrands } from "../apis";
import icons from "../utils/icons";
import CustomSelect from "./CustomSelect";

const priceOptions = [
    { value: "", label: "Price - All" },
    { value: "1", label: "0 - 1.000.000 VND" },
    { value: "2", label: "1.000.000 VND - 2.000.000 VND" },
    { value: "3", label: "2.000.000 VND - 3.000.000 VND" },
    { value: "4", label: "3.000.000 VND - 5.000.000 VND" },
    { value: "5", label: "5.000.000 VND - 7.000.000 VND" },
    { value: "6", label: "7.000.000 VND - 10.000.000 VND" },
    { value: "7", label: "10.000.000 VND - 15.000.000 VND" },
    { value: "8", label: "15.000.000 VND - 20.000.000 VND" },
    { value: "9", label: "20.000.000 VND - 30.000.000 VND" },
    { value: "10", label: "30.000.000 VND +" },
];

const Filter = () => {
    const [brands, setBrands] = useState([{ value: "", label: "Brand - All" }]);
    const categories = useSelector((state) => state.app.categories);

    const categoryOptions =
        categories?.map((category) => ({
            value: category.title,
            label: category.title,
        })) || [];
    categoryOptions.splice(0, 0, { value: "", label: "Category - All" });

    const fetchBrands = async () => {
        const response = await apiGetBrands();
        if (response.success) {
            const brandOptions =
                response.brands?.map((brands) => ({
                    value: brands.title,
                    label: brands.title,
                })) || [];
            setBrands((prev) => [...prev, ...brandOptions]);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <div className="flex gap-2">
            <div className="w-1/4">
                <CustomSelect
                    placeholder="Price"
                    defaultValue={priceOptions[0]}
                    isSearchable={false}
                    options={priceOptions}
                />
            </div>
            <div className="w-1/4">
                <CustomSelect
                    placeholder="Brand"
                    defaultValue={brands[0]}
                    isSearchable={false}
                    options={brands}
                />
            </div>
            <div className="w-1/4">
                <CustomSelect
                    placeholder="Category"
                    defaultValue={categoryOptions[0]}
                    isSearchable={false}
                    options={categoryOptions}
                />
            </div>
        </div>
    );
};

export default Filter;
