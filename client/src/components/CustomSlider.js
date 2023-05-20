import React, { memo } from "react";
import Slider from "react-slick";
import {Product} from "./";

const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const CustomSlider = ({ products, activeTab = 2 }) => {
    return (
        products && (
            <Slider {...settings}>
                {products?.map((item) => (
                    <Product
                        key={item._id}
                        productData={item}
                        isNew={activeTab === 2}
                    />
                ))}
            </Slider>
        )
    );
};

export default memo(CustomSlider);
