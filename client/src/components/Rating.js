import React, { useEffect, useState } from "react";
import Button from "./Button";
import icons from "../utils/icons";
import { apiRatingProduct } from "../apis";

const { AiFillStar, AiOutlineStar } = icons;

const Rating = ({
    starStore,
    commentStore,
    pid,
    oid,
    token,
    fetch = async () => {},
}) => {
    const [starCount, setStarCount] = useState([0, 0, 0, 0, 0]);
    const [star, setStar] = useState(starStore || 5);
    const [comment, setComment] = useState(commentStore || "");
    const [disabled, setDisabled] = useState(true);

    const createArrStart = (num) => {
        const arr = new Array(5).fill(0);
        for (let i = 0; i < num; i++) {
            arr[i] = 1;
        }
        return arr;
    };

    const handleHoverStar = (index) => {
        setStarCount(createArrStart(index + 1));
    };

    const handleMouseOutStar = (e) => {
        e.stopPropagation();
        setStarCount(createArrStart(star));
    };

    const handleRating = async () => {
        await apiRatingProduct(token, {
            star,
            comment,
            pid,
            oid,
        });
        await fetch();
        return true;
    };

    useEffect(() => {
        setStarCount(createArrStart(star));
    }, [star]);

    useEffect(() => {
        if (star === starStore && comment === commentStore) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [star, comment, starStore, commentStore]);

    return (
        <div className="flex justify-center flex-col">
            <div className="flex justify-center my-4">
                <div className="flex gap-1" onMouseLeave={handleMouseOutStar}>
                    {starCount.map((el, index) =>
                        el % 2 === 0 ? (
                            <AiOutlineStar
                                key={index}
                                size={30}
                                className="hover:cursor-pointer"
                                onMouseEnter={() => handleHoverStar(index)}
                                onClick={() => {
                                    setStar(+index + 1);
                                }}
                            />
                        ) : (
                            <AiFillStar
                                key={index}
                                size={30}
                                className="hover:cursor-pointer text-yellow-400"
                                onMouseEnter={() => handleHoverStar(index)}
                                onClick={() => {
                                    setStar(+index + 1);
                                }}
                            />
                        )
                    )}
                </div>
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border-2 min-h-[100px] max-h-[300px] p-3 rounded-md outline-none"
                maxLength={2000}
                placeholder="Your comment"
            />
            <div className="flex justify-end mt-4">
                <div className="w-[100px]">
                    <Button
                        name="Save"
                        rounded
                        handleClick={handleRating}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default Rating;
