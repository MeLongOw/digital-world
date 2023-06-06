import React, { useEffect } from "react";

const SelectVariant = ({
    variants,
    payload,
    setPayload = () => {},
}) => {
    const filterUniqueVariants = (payload) => {
        const uniqueVariants = {};

        payload.forEach((item) => {
            uniqueVariants[item.label] = item.variant;
        });

        const uniqueData = Object.keys(uniqueVariants).map((label) => {
            return {
                label: label,
                variant: uniqueVariants[label],
            };
        });

        return uniqueData;
    };

    useEffect(() => {
        setPayload(
            variants.map((variant) => ({
                label: variant?.label,
                variant: variant?.variants.find((el) => el.quantity > 0),
            }))
        );
    }, [variants, setPayload]);
    return (
        <div>
            {variants?.map((variant) => (
                <div className="flex items-center mb-3" key={variant.label}>
                    <span className="w-[90px] flex-shrink-0">
                        {variant?.label}
                    </span>
                    <div className="flex gap-2 flex-wrap">
                        {variant?.variants?.map((el) => (
                            <button
                                key={el.variant}
                                className={`border text-center px-4 py-3 flex items-center text-sm uppercase
                                 ${
                                     payload.some((item) => {
                                         return (
                                             item.variant.variant === el.variant &&
                                             item.label === variant.label &&
                                             el.quantity > 0
                                         );
                                     })
                                         ? "border-main text-main"
                                         : "hover:border-gray-400"
                                 }`}
                                onClick={() => {
                                    setPayload((prev) =>
                                        filterUniqueVariants([
                                            ...prev,
                                            {
                                                label: variant?.label,
                                                variant: el,
                                            },
                                        ])
                                    );
                                }}
                            >
                                {el.variant}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SelectVariant;
