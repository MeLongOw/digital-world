import React, { memo, useState } from "react";
import { capitalize, renderStarFromNumber } from "../utils/helpers";
import moment from "moment";

const DetailDescription = ({ description = [], review = [] }) => {
    console.log({ review });
    const contentBox = [
        { id: 1, label: "DESCRIPTION", title: "", content: description },
        {
            id: 2,
            label: "WARRANTY",
            title: "WARRANTY INFORMATION",
            content: [
                "LIMITED WARRANTIES",
                "Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:",
                "",
                "Frames Used In Upholstered and Leather Products",
                "Limited Lifetime Warranty",
                "A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.",
            ],
        },
        {
            id: 3,
            label: "DELIVERY",
            title: "PURCHASING & DELIVERY",
            content: [
                "Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.",
                "Picking up at the store",
                "Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.",
                "Delivery",
                "Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.",
                "In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.",
            ],
        },
        {
            id: 4,
            label: "PAYMENT",
            title: "PURCHASING & DELIVERY",
            content: [
                "Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.",
                "Picking up at the store",
                "Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.",
                "Delivery",
                "Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.",
                "In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.",
            ],
        },
        {
            id: 5,
            label: "CUSTOMER REVIEW",
            title: "CUSTOMERS REVIEWS",
            content: review.sort((a, b) => {
                if (a?.createdAt > b?.createdAt) {
                    return -1;
                }
                if (a?.createdAt < b?.createdA) {
                    return 1;
                }
                return 0;
            }),
        },
    ];

    const [boxActive, setboxActive] = useState(1);
    return (
        <div className="flex md:flex-col mb-[50px]">
            <div className="flex max-md:flex-col gap-1">
                {contentBox.map((item) => (
                    <div
                        key={item.id}
                        className={`px-5 py-[9px] max-sm:px-2 max-sm:text-xs text-gray-700 border ${
                            item.id === boxActive
                                ? "bg-white md:border-b-white max-md:border-r-white z-10"
                                : "bg-gray-200 hover:cursor-pointer"
                        } `}
                        onClick={() => {
                            setboxActive(item.id);
                        }}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
            <div className="w-full border md:mt-[-1px] max-md:ml-[-1px] text-gray-700 p-5">
                {contentBox.map((item) => {
                    if (item.id === 1)
                        return (
                            <div
                                key={item.id}
                                className={`${
                                    item.id === boxActive ? "" : "hidden"
                                } animate-slide-in-fwd-center`}
                                onClick={() => {
                                    setboxActive(item.id);
                                }}
                            >
                                {item.title && (
                                    <h3 className="mb-[10px] text-xl text-gray-700 font-semibold">
                                        {item.title}
                                    </h3>
                                )}
                                {item.content.map((item, index) =>
                                    item ? (
                                        <li
                                            className="text-sm mb-[5px]"
                                            key={index}
                                        >
                                            {item}
                                        </li>
                                    ) : (
                                        <br key={index} />
                                    )
                                )}
                            </div>
                        );
                    else if (item.id === 5)
                        return (
                            <div
                                key={item.id}
                                className={`${
                                    item.id === boxActive ? "" : "hidden"
                                } animate-slide-in-fwd-center`}
                                onClick={() => {
                                    setboxActive(item.id);
                                }}
                            >
                                {item.title && (
                                    <h3 className="mb-[10px] text-xl text-gray-700 font-semibold">
                                        {item.title}
                                    </h3>
                                )}
                                <div className="overflow-y-scroll max-h-screen">
                                    {item.content.length ? (
                                        item.content.map((item) => (
                                            <div
                                                className="flex flex-col gap-2 text-sm pb-3 mb-4 border-b"
                                                key={item._id}
                                            >
                                                <span className="font-medium">
                                                    {capitalize(
                                                        `${item?.postedBy?.firstName} ${item?.postedBy?.lastName}`
                                                    )}
                                                </span>
                                                <span className="flex">
                                                    {renderStarFromNumber(
                                                        +item?.star
                                                    )}
                                                </span>
                                                <i>
                                                    {moment(
                                                        item?.createdAt
                                                    ).format(
                                                        "HH:mm:ss DD/MM/YYYY"
                                                    )}
                                                </i>
                                                <span>{item?.comment}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <i>This product has no rating</i>
                                    )}
                                </div>
                            </div>
                        );
                    else
                        return (
                            <div
                                key={item.id}
                                className={`${
                                    item.id === boxActive ? "" : "hidden"
                                } animate-slide-in-fwd-center`}
                                onClick={() => {
                                    setboxActive(item.id);
                                }}
                            >
                                {item.title && (
                                    <h3 className="mb-[10px] text-xl text-gray-700 font-semibold">
                                        {item.title}
                                    </h3>
                                )}
                                {item.content.map((item, index) =>
                                    item ? (
                                        <p
                                            className="text-sm mb-[10px]"
                                            key={index}
                                        >
                                            {item}
                                        </p>
                                    ) : (
                                        <br key={index} />
                                    )
                                )}
                            </div>
                        );
                })}
            </div>
        </div>
    );
};

export default memo(DetailDescription);
