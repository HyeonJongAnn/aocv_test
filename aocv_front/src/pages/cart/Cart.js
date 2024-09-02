import React, { useState, useEffect } from 'react';
import '../../scss/pages/cart/Cart.scss';
import { Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FullWidthButton from '../../components/button/FullWidthButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EditCartItemModal from './EditCartItemModal';
import Button from '../../components/button/Button';
import { deleteCartItem, deleteSelectedCartItems, fetchCartItems, updateCartItem } from '../../apis/cartApi';
import { setCartItems } from '../../slices/CartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.loginUserId);
  const items = useSelector(state => state.cart.items);
  const allItems = useSelector(state => state.item.itemDTO); // 모든 아이템 정보 가져오기
  const [price, setPrice] = useState(0);
  const [count, setCount] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [shipping, setShipping] = useState(0); // 기본 배송비
  const [editItem, setEditItem] = useState(null); // 모달창을 위한 상태
  console.log(items);
  console.log(allItems)

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [userId, dispatch, editItem]);

  const handleImageClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleSelectAll = (event) => {
    const newSelectAll = event.target.checked;
    setSelectAll(newSelectAll);
    const newItems = items.map(item => ({ ...item, checked: newSelectAll }));
    dispatch(setCartItems(newItems));
    updatePriceAndCount(newItems);
  };

  const handleDeleteItem = async (id) => {
    dispatch(deleteCartItem({ userId, id }))
      .unwrap()
      .then(() => {
        const updatedItems = items.filter(item => item.id !== id);
        dispatch(setCartItems(updatedItems));
        updatePriceAndCount(updatedItems);
      });
  };

  const handleDeleteSelectedItems = async () => {
    const selectedIds = items.filter(item => item.checked).map(item => item.id);
    dispatch(deleteSelectedCartItems({ userId, selectedIds }))
      .unwrap()
      .then(() => {
        const updatedItems = items.filter(item => !item.checked);
        dispatch(setCartItems(updatedItems));
        updatePriceAndCount(updatedItems);
      });
  };

  const handleItemCheck = (id) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    dispatch(setCartItems(newItems));
    setSelectAll(newItems.every(item => item.checked));
    updatePriceAndCount(newItems);
  };

  const updatePriceAndCount = (items) => {
    let totalPrice = 0;
    let checkedCount = 0;
    let totalCount = 0;
    items.forEach(item => {
      if (item.checked) {
        totalPrice += item.price * item.quantity;
        checkedCount += item.quantity;
      }
      totalCount += item.quantity;
    });
    setPrice(totalPrice);
    setCount(checkedCount);

    if (checkedCount === 0) {
      setShipping(0);
    } else {
      if (totalPrice >= 100000) {
        setShipping(0);
      } else {
        setShipping(3000);
      }
    }
  };

  const handleOrder = () => {
    const selectedItems = items.filter(item => item.checked);
    navigate("/user/order", { state: { selectedItems, price, shipping } });
  };

  const handleEditItem = (item) => {
    setEditItem(item);
  };

  const handleSaveItem = (updatedItem) => {
    console.log('Updated item:', updatedItem);
    dispatch(updateCartItem({ userId, updatedItem }))
      .unwrap()
      .then((result) => {
        dispatch(fetchCartItems(userId));
        alert('정상적으로 수정되었습니다.');
        setEditItem(null);
      })
      .catch((error) => {
        alert('업데이트에 실패했습니다.');
        console.log(error);
      });
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getItemType = (itemId) => {
    // allItems 객체에서 content 배열을 가져옵니다.
    const itemsArray = allItems.content;

    // itemsArray에서 해당 itemId와 일치하는 아이템을 찾습니다.
    const item = itemsArray.find(item => item.id === itemId);

    // 해당 아이템의 타입을 반환합니다. 아이템이 없으면 null을 반환합니다.
    return item ? item.type : null;
  };

  const renderOptions = (optionId) => {
    
    const option = allItems.content
        .flatMap(item => item.options)
        .find(opt => opt.id === optionId);

    if (!option) return null;

    // 옵션의 속성을 키-값 쌍으로 분리합니다.
    const optionEntries = Object.entries(option.optionAttributes);
    const optionPairs = [];

    // 속성을 두 개씩 묶어서 한 줄로 표시하기 위한 배열 생성
    for (let i = 0; i < optionEntries.length; i += 2) {
        optionPairs.push([optionEntries[i], optionEntries[i + 1] || null]);
    }

    return optionPairs.map(([opt1, opt2], index) => {
        const opt1Price = opt1[0].includes("옵션") ? option.optionPrice || 0 : 0;
        const opt2Price = opt2 && opt2[0].includes("옵션") ? option.optionPrice || 0 : 0;

        return (
            <div key={index} className="orderItemOption">
                <span>{opt1[0]}: {opt1[1]}</span>
                {opt1Price > 0 && <span> (+{formatCurrency(opt1Price)}원)</span>}
                {opt2 && (
                    <>
                        <span> | {opt2[0]}: {opt2[1]}</span>
                        {opt2Price > 0 && <span> (+{formatCurrency(opt2Price)}원)</span>}
                    </>
                )}
            </div>
        );
    });
};

  return (
    <div className='cartContainer'>
      {items.length === 0 ? (
        <div className="no-items">
          <img src={process.env.PUBLIC_URL + '/assets/icons/cart_gray.png'} alt="No Items" className="no-items-image" />
          <span>장바구니가 비어 있습니다.</span>
          <Button text="홈으로 이동" color={'thickgray'} onClick={handleHomeClick} className="homeLocation" />
        </div>
      ) : (
        <>
          <div className='allCheckContainer'>
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              inputProps={{ 'aria-label': '전체 선택' }}
              className="checkBox"
            />
            <span className='mainCheckText'>전체 선택</span>
            <Button className='deleteCheckButton' color={"shadegray"} text={"선택 삭제"} onClick={handleDeleteSelectedItems} disabled={!items.some(item => item.checked)} />
            <Divider />
          </div>
          <div className='cartItemListBox'>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} className='cartItem' >
                  <ListItemIcon>
                    <Checkbox
                      checked={item.checked}
                      onChange={() => handleItemCheck(item.id)}
                    />
                  </ListItemIcon>
                  <img src={item.imageUrl} alt={item.itemName} className='itemImage' onClick={() => handleImageClick(item.itemId)} />
                  <ListItemText
                    primary={<span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{item.itemName}</span>}
                    secondary={
                      <>
                        {getItemType(item.itemId) === 'TSHIRT' && item.petName && (
                          <span style={{ display: 'block' }}>반려동물 이름/성별/생년월일: {item.petName} | 수량: {item.quantity}개</span>
                        )}
                        {getItemType(item.itemId) !== 'TSHIRT' && (
                          <span style={{ display: 'block' }}>수량: {item.quantity}개</span>
                        )}
                        {item.optionId && renderOptions(item.optionId)}
                        <span style={{ display: 'block' }}>총 가격: {item.price ? item.price.toLocaleString() : '0'}원</span>
                      </>
                    }
                  />
                  <Button className="changeButton" color={"shadegray"} text={"옵션/수량"} onClick={() => handleEditItem(item)} />
                  <img className="deleteButton" onClick={() => handleDeleteItem(item.id)} src={process.env.PUBLIC_URL + '/assets/icons/delete_icon.png'} alt="삭제" />
                </ListItem>
              ))}
            </List>
          </div>
          <div className='cartOrderContainer'>
            <div className='cartOrderTextContainer'>
              <h3 className='cartOrderText'>결제할 상품</h3>
              <span className='cartOrderCount'>총 {count}개</span>
            </div>
            <div className='cartItemPrice'>
              <p className='itemPriceText'>결제 금액</p>
              <span className='itemPrice'>{price ? price.toLocaleString() : '0'}원</span>
            </div>
            <div className='cartShippingPrice'>
              <p className='shippingPriceText'>배송비</p><span className='shppingFreeText'>10만원 이상시 배송비 무료*</span>
              <span className='shippingPrice'>+{shipping ? shipping.toLocaleString() : '0'}원</span>
            </div>
          </div>
          <div className='cartOrderButton'>
            <FullWidthButton color={'thickgray'} text={`총 ${count}개 | ${(price + shipping).toLocaleString()}원 결제하기`} onClick={handleOrder} />
          </div>
          {editItem && (
            <EditCartItemModal
              open={!!editItem}
              handleClose={() => setEditItem(null)}
              item={editItem}
              handleSave={handleSaveItem}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Cart;