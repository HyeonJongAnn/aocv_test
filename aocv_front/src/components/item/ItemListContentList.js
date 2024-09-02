import React from 'react';
import ItemListContentItem from './ItemListContentItem';
import '../../scss/Home.scss';

const ItemListContentList = ({ items }) => {
  return (
    <div className='ItemListContentList'>
      {items && items.map(
        (item, index) => <ItemListContentItem key={index} item={item} />
      )}
    </div>
  );
};

export default ItemListContentList;
