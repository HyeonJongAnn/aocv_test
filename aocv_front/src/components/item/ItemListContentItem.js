import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../scss/Home.scss';

const ItemListContentItem = ({ item }) => {
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
  };

  const calculateDiscountPercentage = (originalPrice, salePercentage) => {
    if (!originalPrice || !salePercentage) return 0;
    return Math.round(salePercentage);
  };

  const calculateFinalPrice = (originalPrice, salePercentage) => {
    if (!originalPrice || !salePercentage) return originalPrice;
    return originalPrice - (originalPrice * salePercentage / 100);
  };

  if (!item) {
    return null;
  }

  const handleClick = () => {
    navigate(`/item/${item.id}`);
  };

  const discountPercentage = calculateDiscountPercentage(item.price, item.sale);
  const finalPrice = calculateFinalPrice(item.price, item.sale);

  return (
    <div className='ItemListContentItem' onClick={handleClick}>
      {item.category === 'BEST' && <div className='label best'>BEST</div>}
      {item.category === 'NEW' && <div className='label new'>NEW</div>}
      <img 
        src={item.productImages[0]} 
        alt={item.name} 
      />
      <div>{item.name}</div>
      <div className='priceText'>
        <span className='originalPrice'>{formatCurrency(item.price)}원</span>
        <span className='discountPercentage'>{discountPercentage}%</span>
      </div>
      <div className='finalPrice'>{formatCurrency(finalPrice)}원</div>
    </div>
  );
};

export default ItemListContentItem;
