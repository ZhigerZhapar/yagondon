import React, { useEffect, useState } from 'react';
import cl from "./MyBigButton.module.css";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { setActiveCategory, setSelectedSubcategory } from "../../../../../actions.js";

const MyBigButton = ({ catId,onSelectCategory, handleFilterPageClose, categoryId, onLoadPosts, children, ...props }) => {

    const navigate = useNavigate();
    const [dataChanged, setDataChanged] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const dispatch = useDispatch();
    const selectCurrentSubcategoryId = useSelector(state=>state.title.currentSubcategoryId);

    const handleButtonClick = (e) => {
        e.preventDefault();
        setIsButtonClicked(true); // Установка флага, что кнопка была нажата
        console.log(selectCurrentSubcategoryId)
        if (categoryId) {
            if (onSelectCategory) {
                onSelectCategory({ categoryId });
            }
            handleFilterPageClose();
            navigate(`/page2/${categoryId}?handlebuttonclick=true`);
// Использование useNavigate для изменения URL-адреса страницы
            if (onLoadPosts) {
                onLoadPosts(categoryId);
                setDataChanged(!dataChanged); // Установка флага изменения данных
            }

        } else {
            console.error('Invalid categoryId');
        }


    };

    return (
        <div className={cl.ntclown} onClick={handleButtonClick}>
            <button {...props} className={cl.myBtn}>
                {children}
            </button>
        </div>
    );
};

export default MyBigButton;
