import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../scss/pages/item/ItemDetail.scss';
import FullWidthButton from '../../components/button/FullWidthButton';
import Input from '../../components/Input';
import ReviewReg from '../../pages/reivew/ReviewReg.js';
import { setItemId } from '../../slices/ItemSlice.js';
import { getReview } from '../../apis/reviewApi';
import { Rating } from '@mui/material';
import { getRandomItems, removeItem, getItemDetail } from '../../apis/itemApi';
import { addCartItem } from '../../apis/cartApi.js';
import SelectBox from '../../components/ui/SelectBox.js';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userId = useSelector(state => state.user.loginUserId);
  const loginUser = useSelector(state => state.user.loginUser);
  const userRole = useSelector(state => state.user.loginUserRole);
  const reviews = useSelector(state => state.review.reviewDTO);
  const totalReviews = reviews.length;
  const randomItems1 = useSelector(state => state.item.randomItems1 || []);
  const randomItems2 = useSelector(state => state.item.randomItems2 || []);
  const item = useSelector(state => state.item.currentItem);

  const [mainImage, setMainImage] = useState('');
  const [contentImage, setContentImage] = useState('');
  const [petName, setPetName] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(item ? item.price : 0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }, [reviews]);

  useEffect(() => {
    if (id) {
      dispatch(setItemId(id));
      dispatch(getItemDetail(id));
      dispatch(getReview({ itemId: id, page: 0 }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(getRandomItems('randomItems1'));
    dispatch(getRandomItems('randomItems2'));
  }, [dispatch]);

  useEffect(() => {
    if (item && item.productImages && item.productImages.length > 0) {
      setMainImage(item.productImages[0]);
    }
  }, [item]);

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const calculateDiscountPercentage = (originalPrice, salePercentage) => {
    if (!originalPrice || !salePercentage) return 0;
    return Math.round(salePercentage);
  };

  const calculateFinalPrice = (originalPrice, salePercentage) => {
    if (!originalPrice || !salePercentage) return originalPrice;
    return originalPrice - (originalPrice * salePercentage / 100);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = () => {
    console.log({
      reviewTitle,
      reviewContent,
      reviewRating,
      reviewImages,
    });
    closeModal();
  };

  useEffect(() => {
    if (item) {
      const optionAttributes = new Set(item.options.map(option => Object.keys(option.optionAttributes)).flat());
      const allOptionsSelected = Object.keys(selectedOptions).length === optionAttributes.size;

      if (item.type === 'TSHIRT') {
        setIsButtonDisabled(!(petName && allOptionsSelected));
        setShowSummary(!!petName && allOptionsSelected);
      } else {
        setIsButtonDisabled(!allOptionsSelected);
        setShowSummary(allOptionsSelected);
      }
    } else {
      setIsButtonDisabled(true);
      setShowSummary(false);
    }
  }, [petName, selectedOptions, item]);

  const handleNameChange = (e) => {
    setPetName(e.target.value);
  };

  const calculateBasePrice = () => {
    if (!item) return 0;
    return calculateFinalPrice(item.price, item.sale);
  };

  const calculateTotalPrice = (basePrice = 0, optionPrice = 0) => {
    return basePrice + optionPrice;
  };

  const handleOptionChange = (optionName, optionValue) => {
    setSelectedOptions((prevOptions) => {
        const newOptions = { ...prevOptions, [optionName]: optionValue };

        console.log("Updated options:", newOptions);

        const allOptionsSelected = Object.keys(item.options[0].optionAttributes).every(attr => 
            newOptions[attr] !== undefined
        );

        if (allOptionsSelected) {
            const matchedOption = item.options.find(option => {
                return Object.keys(option.optionAttributes).every(attr => 
                    option.optionAttributes[attr] === newOptions[attr]
                );
            });

            if (matchedOption) {
                const basePrice = calculateBasePrice();
                console.log(`Matching option found: ${matchedOption.optionPrice}`);
                setTotalPrice(calculateTotalPrice(basePrice, matchedOption.optionPrice));
            } else {
                console.log('No matching option found for selected combination.');
                setTotalPrice(calculateBasePrice());
            }
        } else {
            console.log('Not all options selected.');
            setTotalPrice(calculateBasePrice());
        }

        return newOptions;
    });
  };

  const discountPercentage = calculateDiscountPercentage(item ? item.price : 0, item ? item.sale : 0);
  const finalPrice = calculateFinalPrice(item ? item.price : 0, item ? item.sale : 0);

  const handleMouseOver = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleInCart = async () => {
    if (item.type === 'TSHIRT' && !petName) {
        alert('반려동물 이름/성별/생년월일을 입력해 주세요.');
        return;
    }

    const requiredOptionKeys = item.options.map(option => Object.keys(option.optionAttributes)).flat();
    const selectedOptionKeys = Object.keys(selectedOptions);

    const allOptionsSelected = requiredOptionKeys.every(optionKey => selectedOptionKeys.includes(optionKey));

    if (!allOptionsSelected) {
        alert('필수 옵션이 모두 선택되어 있지 않습니다.');
        return;
    }

    if (!userId) {
        alert('로그인 이후에 이용 가능합니다.');
        navigate('/user/sign-in');
        return;
    }

    // 선택된 옵션들에 맞는 최종 optionId를 찾기
    const matchingOption = item.options.find(option => 
        Object.keys(option.optionAttributes).every(attr => 
            option.optionAttributes[attr] === selectedOptions[attr]
        )
    );
console.log(matchingOption)
    if (!matchingOption) {
        alert('해당 옵션 조합에 맞는 제품이 없습니다.');
        return;
    }

    const totalPrice = calculateTotalPrice(calculateBasePrice(), matchingOption.optionPrice);

    const cartItem = {
        itemId: item.id,
        quantity: 1,
        optionId: matchingOption.id,  // 최종 옵션 ID 전송
        petName,
        price: totalPrice,
    };

    console.log("Selected option ID:", matchingOption.id);
    console.log("Sending to backend:", cartItem);

    try {
        await dispatch(addCartItem({ userId, cartItem })).unwrap();
        if (window.confirm('선택하신 제품이 장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?')) {
            navigate('/user/cart');
        }
    } catch (error) {
        alert('오류가 지속되는 경우 관리자에게 문의하세요.');
        console.log(error);
    }
};

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제를 하시겠습니까?')) {
      try {
        await dispatch(removeItem(item.id)).unwrap();
        navigate('/');
      } catch (e) {
        alert('삭제를 실패하였습니다. 다시 시도해 주세요.');
        console.log(e);
      }
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    if (activeTab === 'description') {
      return (
        <div className='content'>
          <p>{item?.content}</p>
          {item?.contentImages?.slice(0).map((image, index) => (
            <img
              key={index}
              className='contentImage'
              src={image}
              alt={"내용이미지"}
            />
          ))}
          <hr className='line1' />
          <div className="random-items">
            <h2>이 상품은 어떠신가요?</h2>
            <div className="random-items-container">
              {randomItems2.length > 0 ? (
                randomItems2.map((randomItem, index) => {
                  const randomDiscountPercentage = calculateDiscountPercentage(randomItem.price, randomItem.sale);
                  const randomFinalPrice = calculateFinalPrice(randomItem.price, randomItem.sale);
                  return (
                    <div
                      key={index}
                      className="random-item"
                      onClick={() => navigate(`/item/${randomItem.id}`)} // 이미지 클릭 시 해당 제품 페이지로 이동
                    >
                      <img src={randomItem.productImages[0]} alt={randomItem.name} className="random-item-image" />
                      <p className='p1'>{randomItem.name}</p>
                      <div className='priceText'>
                        <span className='originalPrice'>{formatCurrency(randomItem.price)}원</span>
                        <span className='discountPercentage'>{randomDiscountPercentage}%</span>
                      </div>
                      <p className='p2'>{formatCurrency(randomFinalPrice)}원</p>
                    </div>
                  );
                })
              ) : (
                <p>추천 제품이 없습니다.</p>
              )}
            </div>
          </div>
          <hr className='line2' />
        </div>
      );
    } else if (activeTab === 'reviews') {
      return (
        <ReviewReg
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          closeModal={closeModal}
          reviewTitle={reviewTitle}
          setReviewTitle={setReviewTitle}
          reviewContent={reviewContent}
          setReviewContent={setReviewContent}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewImages={reviewImages}
          setReviewImages={setReviewImages}
          userId={loginUser}
          itemId={item.id}
          handleSubmit={handleSubmit}
        />
      );
    } else if (activeTab === 'qa') {
      return (
        <div className='content'>
          <p>상품에 대해 궁금한 점이 있으면 해당 메일에 문의 주세요.</p>
          <p>순차적으로 문의에 답변드리고 있으니 양해 부탁 드립니다!</p>
          <p>animal_oh@naver.com</p>
        </div>
      );
    }
  };

  const renderOptionSelectBoxes = () => {
    const optionGroups = {};

    item.options.forEach(option => {
      Object.keys(option.optionAttributes).forEach(attrName => {
        if (!optionGroups[attrName]) {
          optionGroups[attrName] = new Set();
        }
        optionGroups[attrName].add(option.optionAttributes[attrName]);
      });
    });

    const sortedOptionGroups = Object.keys(optionGroups).sort((a, b) => {
      const indexA = item.options.find(option => option.optionAttributes.hasOwnProperty(a)).orderIndex;
      const indexB = item.options.find(option => option.optionAttributes.hasOwnProperty(b)).orderIndex;
      return indexA - indexB;
    });

    const renderSelectBox = (attrName, index) => (
      <SelectBox
        key={index}
        label={attrName}
        options={Array.from(optionGroups[attrName]).reduce((acc, attrValue) => {
          const relatedOptions = item.options.filter(option => option.optionAttributes[attrName] === attrValue);
    
          if (attrName.includes('옵션') && index === 1 && selectedOptions[sortedOptionGroups[0]]) {
            const parentOptionValue = selectedOptions[sortedOptionGroups[0]];
            const matchingOption = relatedOptions.find(opt => opt.optionAttributes[sortedOptionGroups[0]] === parentOptionValue);
    
            if (matchingOption && matchingOption.optionPrice > 0) {
              acc[attrValue] = `${attrValue} (+${formatCurrency(matchingOption.optionPrice)}원)`;
            } else {
              acc[attrValue] = attrValue;
            }
          } else if (!attrName.includes('옵션')) {
            acc[attrValue] = attrValue;
          } else if (relatedOptions.length > 0) {
            const price = relatedOptions[0].optionPrice;
            if (price > 0) {
              acc[attrValue] = `${attrValue} (+${formatCurrency(price)}원)`;
            } else {
              acc[attrValue] = attrValue;
            }
          } else {
            acc[attrValue] = attrValue;
          }
    
          return acc;
        }, {})}
        onSelectChange={({ key, value }) => {
          handleOptionChange(attrName, key);
        }}
        placeholder={`${attrName}을 선택하세요. (필수)`}
      />
    );

    return sortedOptionGroups.map((attrName, index) => renderSelectBox(attrName, index));
  };

  return (
    <>
      {item && (
        <div className="ItemDetailContainer">
          <div className='Box1'>
            <img className='ImgMain'
              src={mainImage}
              alt={item.name} />
            <div className='ImgsBox'>
              {item.productImages.slice(0).map((image, index) => (
                <img
                  key={index}
                  className='Imgs'
                  src={image}
                  alt={item.name}
                  onMouseOver={() => handleMouseOver(image)}
                />
              ))}
            </div>
          </div>
          <div className='Box2'>
            <div className='name'>
              {item.name}
            </div>
            <div className={`status ${item.status.toLowerCase()}`}>
              {item.status}
            </div>
            <div className='title'>
              {item.title}
            </div>

            <div className='rivew'>
              구매 후기 ({totalReviews})
            </div>
            <Rating
              value={averageRating}
              readOnly
              precision={1}
              className='rating2'
            />
            <div className='price'>
              <span className='originalPrice'>{formatCurrency(item.price)}원</span>
              <span className='discountPercentage'>{discountPercentage}%</span>
            </div>
            <span className='finalPrice'>{formatCurrency(finalPrice)}원</span>
            <hr />
            <div className='address'>
              <p>배송방법 택배 (CJ 대한통운)</p>
              <p>배송비 3,000원</p>
              <p className='p3'>제주 추가 3,500원, 제주 외 도서지역 추가 7,000원</p>
            </div>
            {item.type === 'TSHIRT' && (
              <div className='Itemname'>
                <Input
                  type="text"
                  name="petName"
                  placeholder="반려동물 이름/성별/생년월일을 입력해주세요."
                  label="반려동물 이름/성별/생년월일(모르시는 부분은 공란)*"
                  labelClassName="bold-label"
                  className="small-placeholder"
                  value={petName}
                  onChange={handleNameChange}
                />
              </div>
            )}
            {renderOptionSelectBoxes()}

            {showSummary && (
              <>
                <div className='selected-options'>
                  {item.type === 'TSHIRT' && <p>반려동물 이름/성별/생년월일: {petName}</p>}
                  {Object.entries(selectedOptions).map(([optionName, option]) => (
                    <p key={optionName}>{optionName}: {option}</p>
                  ))}
                </div>
                <div className='total-price'>
                  총 상품금액: {isNaN(totalPrice) ? "0" : formatCurrency(totalPrice)}원
                </div>
              </>
            )}

            <FullWidthButton
              text={item.status === 'SOLD_OUT' ? "품절된 상품 입니다." : "장바구니 담기"}
              color={item.status === 'SOLD_OUT' ? "gray" : "thickgray"}
              disabled={isButtonDisabled || item.status === 'SOLD_OUT'}
              onClick={item.status === 'SOLD_OUT' ? null : handleInCart}
            />
            {userRole === "ROLE_ADMIN" && (
              <div className='modify'>
                <FullWidthButton text={"수정하기"} color={"green"} onClick={() => navigate(`/admin/item/modify/${id}`)} />
              </div>
            )}
            {userRole === "ROLE_ADMIN" && (
              <div className='delete'>
                <FullWidthButton text={"삭제하기"} color={"red"} onClick={handleDelete} />
              </div>
            )}
          </div>
        </div>
      )}
      <hr className='line1' />
      <div className="random-items">
        <h2>이 상품은 어떠신가요?</h2>
        <div className="random-items-container">
          {randomItems1.length > 0 ? (
            randomItems1.map((randomItem, index) => {
              const randomDiscountPercentage = calculateDiscountPercentage(randomItem.price, randomItem.sale);
              const randomFinalPrice = calculateFinalPrice(randomItem.price, randomItem.sale);
              return (
                <div
                  key={index}
                  className="random-item"
                  onClick={() => navigate(`/item/${randomItem.id}`)}
                >
                  <img src={randomItem.productImages[0]} alt={randomItem.name} className="random-item-image" />
                  <p className='p1'>{randomItem.name}</p>
                  <div className='priceText'>
                    <span className='originalPrice'>{formatCurrency(randomItem.price)}원</span>
                    <span className='discountPercentage'>{randomDiscountPercentage}%</span>
                  </div>
                  <p className='p2'>{formatCurrency(randomFinalPrice)}원</p>
                </div>
              );
            })
          ) : (
            <p>추천 제품이 없습니다.</p>
          )}
        </div>
      </div>
      <hr className='line1' />
      <div className='tab-menu'>
        <p onClick={() => setActiveTab('description')} className={activeTab === 'description' ? 'active' : ''}>상세 설명</p>
        <p onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? 'active' : ''}>구매 후기 ({totalReviews})</p>
        <p onClick={() => setActiveTab('qa')} className={activeTab === 'qa' ? 'active' : ''}>문의</p>
      </div>
      <hr className='line2' />
      {renderContent()}
    </>
  );
};

export default ItemDetail;
