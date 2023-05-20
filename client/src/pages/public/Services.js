import React from "react";

const allServices = [
    {
        image: "https://cdn.shopify.com/s/files/1/1636/8779/files/settings.png?v=1491835711",
        title: "Customizable Page",
        descirption:
            "Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora",
    },
    {
        image: "https://cdn.shopify.com/s/files/1/1636/8779/files/picture.png?v=1491835656",
        title: "Revolution Slider",
        descirption:
            "Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora",
    },
    {
        image: "https://cdn.shopify.com/s/files/1/1636/8779/files/layout.png?v=1491835677",
        title: "Drag & Drop Page",
        descirption:
            "Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora",
    },
    {
        image: "https://cdn.shopify.com/s/files/1/1636/8779/files/picture.png?v=1491835656",
        title: "Revolution Slider",
        descirption:
            "Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora",
    },
    {
        image: "https://cdn.shopify.com/s/files/1/1636/8779/files/settings.png?v=1491835711",
        title: "Customizable Page",
        descirption:
            "Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora",
    },
    {
        image: "https://cdn.shopify.com/s/files/1/1636/8779/files/layout.png?v=1491835677",
        title: "Drag & Drop Page",
        descirption:
            "Fusce arcu molestie eget libero consectetur congue consectetur in bibendum litora",
    },
];

const Services = () => {
    return (
        <div className="flex flex-col w-full items-center">
            <div className="flex gap-5 mb-[50px]">
                <img
                    className="w-[580px] object-contain"
                    src="https://cdn.shopify.com/s/files/1/1636/8779/files/9069783_orig.jpg?v=1491836163"
                    alt=""
                />
                <div className="flex flex-col gap-[10px] text-sm text-gray-600">
                    <p>
                        Cras magna tellus, congue vitae congue vel, facilisis id
                        risus. Proin semper in lectus id faucibus. Aenean vitae
                        quam eget mi aliquam viverra quis quis velit.
                    </p>
                    <p>
                        Curabitur mauris diam, posuere vitae nunc eget, blandit
                        pellentesque mi. Pellentesque placerat nulla at
                        ultricies malesuada. Aenean mi lacus, malesuada at leo
                        vel, blandit iaculis nisl.
                    </p>
                    <p>
                        Praesent vestibulum nisl sed diam euismod, a auctor
                        neque porta. Vestibulum varius ligula non orci tincidunt
                        rutrum. Suspendisse placerat enim eu est egestas,
                        aliquam venenatis elit accumsan. Donec metus quam,
                        posuere sit amet odio et, ultricies consequat nibh.
                    </p>
                </div>
            </div>
            <h3 className="text-2xl mb-3 text-gray-600 font-semibold">
                {" "}
                We Offer Best Services
            </h3>
            <div className="flex flex-wrap w-full">
                {allServices.map((item,index) => (
                    <div
                        className="w-1/3  flex flex-col items-center text-gray-600 p-[30px]"
                        key={index}
                    >
                        <img
                            className="w-[64px] h-[64px] object-contain mb-5"
                            src={item.image}
                            alt=""
                        />
                        <h4 className="text-base mb-2">{item.title}</h4>
                        <p className="mb-2 text-xs text-center">
                            {item.descirption}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
