import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import {
    Login,
    Home,
    Public,
    DetailProduct,
    FAQs,
    Products,
    Services,
    Blogs,
    AuthRegister,
    ResetPassword,
    WishList,
    Cart
} from "./pages/public";
import { getCategories } from "./store/app/asyncThunk";
import path from "./utils/path";

function App() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn)
    useEffect(() => {
        dispatch(getCategories());
    }, []);

    return (
        <div className="min-h-screen font-main">
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route
                        path={path.DETAIL_PRODUCT__SLUG}
                        element={<DetailProduct />}
                    />
                    <Route path={path.FAQs} element={<FAQs />} />
                    <Route path={path.PRODUCTS} element={<Products />} />
                    <Route path={path.BLOGS} element={<Blogs />} />
                    <Route path={path.OUR_SERVICES} element={<Services />} />
                    <Route path={path.WISHLIST} element={<WishList />} />
                    <Route path={path.CART} element={<Cart />} />
                </Route>

                <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
                <Route path={path.AUTH_REGISTER} element={<AuthRegister />} />
                {!isLoggedIn &&<Route path={path.LOGIN} element={<Login />} />}
            </Routes>
        </div>
    );
}

export default App;
