// SubPlaces.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cl from './SubPlaces.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import { useFetch } from '../../../../components/hooks/useFetchB.js';
import axios from 'axios';
import {setSelectedSubcategory, clearSelectedSubcategory, setSelectedSubsubcategory} from '../../../../actions.js';

// ... (ваш импорт)
// SubPlaces.jsx

// ... (импорты и прочий код)

const SubPlaces = ({ subcategoryId, activeCategory }) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    const fetching = useCallback(async () => {
        if (subcategoryId) {
            const response = await axios.get(
                `https://places-test-api.danya.tech/api/sub-categories/${subcategoryId}?populate=subsubcategories,subsubcategories.image`
            );
            setData(response.data || {});
            return response;
        }
    }, [subcategoryId]);

    useEffect(() => {
        fetching();
    }, [fetching]);

    const handleButtonClick = useCallback((subcategory, index) => {
        setSelectedButton(index);
    }, [dispatch]);

    const subsubcategories = data?.data?.attributes?.subsubcategories?.data;
    useEffect(() => {
        setSelectedButton(null);
    }, [subcategoryId, activeCategory, dispatch]);

    // Добавьте проверку на существование subsubcategories перед использованием метода map
    if (!subcategoryId || !subsubcategories || subsubcategories.length === 0) {
        return null;
    }

    return (
        <div className={cl.button__select}>
            <div className={cl.button__select__row}>
                {subsubcategories.map((item, index) => (
                    <MySelectedButton
                        key={index}
                        onClick={() => handleButtonClick(item, index)}
                        isRed={selectedButton === index}
                    >
                        <img
                            className={cl.button__image}
                            src={`https://places-test-api.danya.tech${item?.attributes?.image.data?.attributes?.url}`}
                            alt={`Изображение ${index}`}
                        />
                        {item?.attributes?.title}
                    </MySelectedButton>
                ))}
            </div>
        </div>
    );
};

export default SubPlaces;
