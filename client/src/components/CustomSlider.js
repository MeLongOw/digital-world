import React, { memo } from "react";
import Slider from "react-slick";
import {Product} from "./";

const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
};

const CustomSlider = ({ products, activeTab = 2 }) => {
    return (
        products && (
            <Slider className="custom-slider" {...settings}>
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
