import cl from "./page4.module.css";
import React, { useEffect, useState } from 'react';
import med_backBut from "./assets/icons/med_backBut.svg";
import PiterTwo from "./assets/img/PiterTwo.svg";
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import { useFetch } from "../../components/hooks/useFetchB.js";
import Posts from "../../components/Posts.jsx";
import { useDispatch, useSelector } from "react-redux";
import heart from "../categoryPage/imgs/main/section__publications/icons/heart.svg"
import yellow_heart from "../categoryPage/imgs/main/section__publications/icons/yellow_heart.svg"
import {resetButton, setButtonPressed, setButtons} from "../../features/buttonSlide.js";



const Page4 = () => {
  const [data, setData] = useState({});
  const [cardsToShow, setCardsToShow] = useState(4);
  const dispatch = useDispatch()
  const {buttons} = useSelector(state => state.button)
  const [allData, setAllData] = useState([]);


  const handleButtonClick = async (buttonId, postId) => {
    try {
      // Send a request to the API to toggle the like status
      const response = await axios.get(
          `https://places-test-api.danya.tech/api/like?uid=1295257412&postId=${postId}`
      );


      if (response.data.success) {

        if (buttons[buttonId]?.isPressed) {
          dispatch(resetButton({ buttonId }));
        } else {
          dispatch(setButtonPressed({ buttonId }));
        }
      } else {
        // Handle error if the like request fails
        console.error("Failed to toggle like status");
      }
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error("Error during API request:", error);
    }
  };

  const [fetching, isDataLoading, dataError] = useFetch(async () => {
    const response = await axios.get(
        "https://places-test-api.danya.tech/api/getUser?uid=1295257412"
    );
    setData(response.data || {});
    return response;
  });


  useEffect(() => {
    fetching();
  }, []);

  const PHOTO = data.user?.photoBase64Url || '';
  const LIKED = data.user?.liked?.length || 0;
  const NAME = data.user?.name || '';
  const USERNAME = data.user?.username || '';

  const renderCards = data.user?.liked?.slice(0, cardsToShow) || [];

  const loadMoreCards = () => {
    setCardsToShow((prev) => prev + (data.user?.liked?.length || 0) - 4);
  };

  const updateLikedItems = (postId) => {
    setData((prevData) => {
      const updatedLikedItems = prevData.user?.liked.filter(item => item.id !== postId);
      return {
        ...prevData,
        user: {
          ...prevData.user,
          liked: updatedLikedItems,
        },
      };
    });
  };



  console.log(renderCards)

  return (
      <>
        <main className={cl.profile}>
          <Link to={"/"}>
            <a href="#!" id={cl.back}>
              <img src={med_backBut} alt="" />
            </a>
          </Link>
          <div className={cl.user_images}>
            <div id={cl.circle_img}>
              <img src={`${data.user?.photoBase64Url}`} alt="" id={cl.user_img} />
            </div>
            <p id={cl.tag_saved}>{isDataLoading ? <span>...Loading </span> : <span>{data.user?.liked?.length} сохранений</span>}</p>
          </div>
          <div className={cl.user_date}>
            <h1 id={cl.user_name}>{isDataLoading ? <span>...Loading </span> : <span>{data.user?.name}</span>}</h1>
            <p id={cl.user_tag}>{isDataLoading ? <span>...Loading </span> : <span>{data.user?.username}</span>}</p>
          </div>
        </main>

        <section className={cl.saved}>
          <div className={cl.texxt_title}>
            <h2>СОХРАНЕНИЯ</h2>
            <span>({data.user?.liked?.length})</span>
          </div>
          <div className={cl.list_saved}>
            {renderCards.map((like, index) => (
                <div key={index} className={cl.block_saved}>
                  {like.images.map((image, imgIndex) => (
                      <Link key={index + 1} to={`page4/previewPage/${like.id}?categoryId=${like?.category?.id}`}>
                      <img
                          key={imgIndex}
                          src={`https://places-test-api.danya.tech${image.url}`}
                          alt=""
                          className={cl.saved_img}
                      />
                      </Link>
                  ))}
                  <button onClick={() => { handleButtonClick(like.id, like.id); updateLikedItems(like.id); }} className={cl.like_icon}>
                    <img src={buttons[like.id]?.isPressed ? yellow_heart : heart} alt="" />
                  </button>
                  <p>{like?.category?.title}</p>
                  <h2>{like?.title}</h2>
                </div>
            ))}
          </div>
          {cardsToShow < (data.user?.liked?.length || 0) && (
              <button onClick={loadMoreCards} className={cl.but}>
                ПОКАЗАТЬ ВСЕ
              </button>
          )}
        </section>
        {/* <Posts updateLikedItems={updateLikedItems} /> */}
        <section className={cl.invite}>
          <img src={PiterTwo} alt="" />
          <h2>Зови друзей!</h2>
          <p>
            На случай если очень хочется поделиться нашим приложением с друзьями:{" "}
            <br /> отправляй эту пригласительную ссылку 👇
          </p>
          <p id={cl.hrefTG}>t.me/spbneformal_app_bot</p>
          <button className={cl.but}>СКОПИРОВАТЬ ССЫЛКУ</button>
        </section>

        <section className={cl.homeBlock3}></section>

        <section className={cl.homeBlock4}></section>
      </>
  );
};

export default Page4;
