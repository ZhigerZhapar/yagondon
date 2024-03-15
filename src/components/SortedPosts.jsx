import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import yellow_heart from './../Home/categoryPage/imgs/main/section__publications/icons/yellow_heart.svg';
import heart from './../Home/page2/img/food/heart.svg';
import { resetButton, setButtonPressed, setButtons } from './../features/buttonSlide.js';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from './hooks/useFetch.js';
import cl from './../Home/page2/page2.module.css';
import Loader from "./UI/Loader/Loader.jsx";
import axios from "axios";
import { setSelectedSubcategory } from "../actions.js";

const SortedPosts = ({ fId, categoryId, categoryTitle }) => {
    const [localData, setLocalData] = useState([]);
    const dispatch = useDispatch();
    const { buttons } = useSelector(state => state.button);
    const [allData, setAllData] = useState([]);

    const { data, loading, error } = useFetch(
        `https://places-test-api.danya.tech/api/categories/${fId}?populate=posts,posts.images,category,posts.subcategory,posts.subsubcategory`
    );

    const selectedSubcategory = useSelector(state => state.title.selectedSubcategory);
    useEffect(() => {
        if (selectedSubcategory !== null) {
            handleSelectedSubcategoryChange(selectedSubcategory);
        }
    }, [selectedSubcategory]);
    useEffect(() => {
        handleSelectedSubcategoryChange(selectedSubcategory);
    }, [selectedSubcategory]);

    useEffect(() => {
        const savedSubcategory = JSON.parse(localStorage.getItem('selectedSubcategory'));
        if (savedSubcategory !== undefined) {
            dispatch(setSelectedSubcategory(savedSubcategory));
        }
    }, [dispatch]);

    const handleSelectedSubcategoryChange = (subcategory) => {
        console.log("Selected subcategory changed:", subcategory);
    };
    useEffect(() => {
        if (!loading && !error && data && data.attributes && data.attributes.posts && data.attributes.posts.data) {
            console.log("SortedPosts - Data received:", data);
            setLocalData(data.attributes.posts.data || []);
        }
    }, [data, loading, error, categoryId, fId]);

    const handleButtonClick = async (buttonId, postId) => {
        try {
            const response = await axios.get(
                `https://places-test-api.danya.tech/api/like?uid=1295257412&postId=${postId}`
            );

            if (response.data.success) {
                const isPressed = buttons[buttonId]?.isPressed;

                dispatch(isPressed ? resetButton({ buttonId }) : setButtonPressed({ buttonId }));

                if (response.data?.user?.liked) {
                    dispatch(setButtons(response.data.user.liked));
                }
            } else {
                console.error("Failed to toggle like status");
            }
        } catch (error) {
            console.error("Error during API request:", error);
        }
    };
    const seks = useSelector(state=>state.title.subsubcategory)
    console.log(seks)
    const filteredData = data?.attributes?.posts?.data
        ? data.attributes.posts.data.filter(post => {
            const postSubcategoryId = post.attributes.subcategory?.data?.id;
            const postSubsubcategoryIds = Array.isArray(post.attributes.subsubcategory?.data)
                ? post.attributes.subsubcategory.data.map(subsubcategory => subsubcategory.id)
                : [];
            // Проверяем, что айдишник подкатегории или один из айдишников подподкатегорий равен выбранному айдишнику
            return postSubcategoryId === selectedSubcategory || postSubsubcategoryIds.includes(selectedSubcategory);
        })
        : [];

    useEffect(() => {
        if (data && data.length > 0) {
            const uniqueData = data.filter((newPost) => {
                return !allData.some((existingPost) => existingPost.id === newPost.id);
            });

            setAllData((prevData) => [...prevData, ...uniqueData]);
        }
    }, [data]);

    return (
        <div className={`${cl.food__bottom} ${cl._container}`}>
            {loading ? (
                <div className={cl.loaderContainer}>
                    <Loader />
                </div>
            ) : (
                <div className={`${cl.food__row}`}>
                    {(filteredData.length > 0 ? filteredData : localData).map((post) => (
                        <div className={`${cl.food__column}`} key={post.id}>
                            <div>
                                <Link to={`/page2/previewPage/${post.id}?categoryId=${categoryId}`}>
                                    <img className={cl.kaban} src={`https://places-test-api.danya.tech${post.attributes.images.data[0].attributes.url}`} alt="" />
                                </Link>
                            </div>
                            <button onClick={() => handleButtonClick(post.id, post.id)} className={`${cl.main_like}`}>
                                <img src={buttons[post.id]?.isPressed ? yellow_heart : heart} alt="" />
                            </button>
                            <div className="food__content">
                                <h2 className={`${cl.food__name}`}>
                                    {post?.attributes?.subsubcategory?.data?.attributes?.title
                                        ? post?.attributes?.subsubcategory?.data?.attributes?.title
                                        : post?.attributes?.subcategory?.data?.attributes?.title
                                            ? post?.attributes?.subcategory?.data?.attributes?.title
                                            : post?.attributes?.category?.data?.attributes?.title
                                    }
                                </h2>
                                <p className={`${cl.food__position}`}>{post.attributes.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SortedPosts;
