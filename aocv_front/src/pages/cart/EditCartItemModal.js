import React, { useState, useEffect } from 'react';
import { Modal, Box, FormControl } from '@mui/material';
import JoinBox from '../../components/JoinBox';
import SelectBox from '../../components/ui/SelectBox';
import FullWidthButton from '../../components/button/FullWidthButton';
import { useSelector } from 'react-redux';

const EditCartItemModal = ({ open, handleClose, item, handleSave }) => {
  // Redux에서 itemDTO 가져오기
  const itemDTO = useSelector(state => state.item.itemDTO);
  
  const [currentItem, setCurrentItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({
    id: '',
    quantity: 1,
    selectedOptions: {},
    basePrice: 0,
    totalPrice: 0,
    optionId: null,
  });

  useEffect(() => {
    if (!item || !itemDTO) return;

    // itemDTO.content에서 itemId에 해당하는 제품 찾기
    const foundItem = itemDTO.content.find(product => product.id === Number(item.itemId));
    if (!foundItem) {
        console.error('Could not find item with itemId:', item.itemId);
        return;
    }
    setCurrentItem(foundItem);

    const selectedOption = foundItem.options.find(opt => opt.id === item.optionId);
    const initialOptions = selectedOption ? selectedOption.optionAttributes : {};
    const initialOptionPrices = selectedOption ? selectedOption.optionPrice : 0;
    const basePrice = item.price - initialOptionPrices;

    setUpdatedItem({
      id: item.id,
      quantity: item.quantity,
      selectedOptions: initialOptions,
      basePrice: basePrice,
      totalPrice: item.price,
      optionId: item.optionId,
    });

  }, [item, itemDTO]);

  const handleChange = (name, value) => {
    const selectedOption = currentItem.options.find(opt => opt.optionAttributes[name] === value.key);
    const selectedOptionPrice = selectedOption ? selectedOption.optionPrice : 0;

    setUpdatedItem(prev => {
        const oldOptionPrice = prev.selectedOptions[name]
            ? currentItem.options.find(opt => opt.optionAttributes[name] === prev.selectedOptions[name])?.optionPrice || 0
            : 0;

        const newSelectedOptions = {
            ...prev.selectedOptions,
            [name]: value.key,
        };

        const newTotalPrice = prev.basePrice + Object.values(newSelectedOptions).reduce((total, key) => {
            const option = currentItem.options.find(opt => opt.optionAttributes[name] === key);
            return total + (option ? option.optionPrice : 0);
        }, 0);

        console.log('Updated Options:', newSelectedOptions);
        console.log('New Total Price:', newTotalPrice);

        return {
            ...prev,
            selectedOptions: newSelectedOptions,
            totalPrice: newTotalPrice,
        };
    });
  };

  const handleSaveClick = () => {
    if (!currentItem || !currentItem.options) return;

    const selectedOptionId = currentItem.options.find(opt =>
      Object.entries(opt.optionAttributes).every(
        ([key, val]) => updatedItem.selectedOptions[key] === val
      )
    )?.id;

    if (!selectedOptionId) {
      alert('선택한 옵션 조합이 유효하지 않습니다.');
      return;
    }

    const itemToUpdate = {
      id: updatedItem.id,
      quantity: updatedItem.quantity,
      optionId: selectedOptionId,
      price: updatedItem.totalPrice,
    };

    handleSave(itemToUpdate);
    handleClose();
  };

  const renderOptions = (options) => {
    if (!options) return null;

    const optionValuesMap = options.reduce((acc, option) => {
      Object.entries(option.optionAttributes).forEach(([key, value]) => {
        if (!acc[key]) {
          acc[key] = new Set();
        }
        acc[key].add(value);
      });
      return acc;
    }, {});

    return Object.entries(optionValuesMap).map(([key, values], index) => (
      <FormControl key={`${key}-${index}`} fullWidth margin="normal">
        <SelectBox
          label={key}
          options={Array.from(values).reduce((acc, value) => {
            const option = options.find(opt => opt.optionAttributes[key] === value);
            const price = option ? option.optionPrice : 0;
            acc[value] = `${value} ${price > 0 ? `(+${price.toLocaleString()}원)` : ''}`;
            return acc;
          }, {})}
          fontSize="12px"
          onSelectChange={(value) => handleChange(key, value)}
          value={updatedItem.selectedOptions[key] || ''}
          placeholder={`${key}를 선택하세요.`}
        />
      </FormControl>
    ));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-item-modal-title"
      aria-describedby="edit-item-modal-description"
    >
      <Box sx={{ ...modalStyle }}>
        <h2 id="edit-item-modal-title">옵션/수량 변경</h2>
        {currentItem && currentItem.options && renderOptions(currentItem.options)}
        <JoinBox
          name="quantity"
          titleName="수량"
          placeholder="수량을 입력 해주세요."
          type="number"
          value={updatedItem.quantity}
          onChange={(e) => setUpdatedItem({ ...updatedItem, quantity: e.target.value })}
          fullWidth
          inputProps={{ min: 1 }}
        />
        <div className='totalPriceDisplay'>
          총 가격: {updatedItem.totalPrice.toLocaleString()}원
        </div>
        <FullWidthButton style={{ marginTop: '20px' }} onClick={handleSaveClick} color={'thickgray'} text={"수정하기"} />
      </Box>
    </Modal>
  );
};

export default EditCartItemModal;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};