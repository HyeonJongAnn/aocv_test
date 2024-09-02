import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../apis/itemApi.js';
import { useNavigate } from 'react-router-dom';
import JoinBox from '../../components/JoinBox';
import SelectBox from '../../components/ui/SelectBox.js';
import '../../scss/pages/admin/AdminPage.scss';
import FullWidthButton from '../../components/button/FullWidthButton.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    contentImages: [],
    productImages: [],
    price: '',
    status: '',
    type: '',
    sale: '',
    category: '',
    options: [],
    quantity: 0,
  });

  const [optionInputs, setOptionInputs] = useState([{ optionName: '', optionValues: '' }]);

  const titleName = ['제품명', '제목', '상세 설명', '상세 설명 이미지', '제품 이미지', '가격', '제품 상태', '제품 유형', '세일', '카테고리', '재고수량'];

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseCurrency = (value) => {
    return parseInt(value.replace(/,/g, ''), 10);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData({ ...formData, [name]: parseCurrency(value) });
    } else if (name === 'sale') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const newFiles = Array.from(files);

    setFormData((prevFormData) => {
      const currentFiles = prevFormData[name];
      const totalFiles = currentFiles.length + newFiles.length;

      if (totalFiles > 10) {
        alert('파일은 최대 10개까지 선택할 수 있습니다.');
        return prevFormData;
      }

      return {
        ...prevFormData,
        [name]: [...currentFiles, ...newFiles]
      };
    });
  };

  const handleStatusChange = (selected) => {
    setFormData({ ...formData, status: selected.key });
  };

  const handleTypeChange = (selected) => {
    setFormData({ ...formData, type: selected.key });
  };

  const handleCategoryChange = (selected) => {
    setFormData({ ...formData, category: selected.key });
  };

  const handleOptionInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOptionInputs = [...optionInputs];
    updatedOptionInputs[index] = { ...updatedOptionInputs[index], [name]: value };
    setOptionInputs(updatedOptionInputs);
  };

  const handleAddOptionInput = () => {
    setOptionInputs([...optionInputs, { optionName: '', optionValues: '' }]);
  };

  const handleRemoveOptionInput = (index) => {
    const updatedOptionInputs = optionInputs.filter((_, i) => i !== index);
    setOptionInputs(updatedOptionInputs);
  };

  const combineOptions = (newOptions) => {
    const combinedOptions = [];

    const optionNames = newOptions.map(option => option.optionName);

    const createCombinations = (options, index, currentCombination) => {
      if (index === optionNames.length) {
        combinedOptions.push({
          ...currentCombination
        });
        return;
      }

      const optionName = optionNames[index];
      const optionValues = newOptions.find(option => option.optionName === optionName).optionValues.split(',');

      for (const value of optionValues) {
        createCombinations(options, index + 1, { ...currentCombination, [optionName]: value });
      }
    };

    createCombinations(newOptions, 0, {});

    return combinedOptions;
  };

  const handleAddOptions = () => {
    const combinedOptions = combineOptions(optionInputs);

    setFormData((prevFormData) => ({
      ...prevFormData,
      options: combinedOptions.map((option, index) => ({
        optionAttributes: option,
        orderIndex: index // 입력된 순서대로 orderIndex 설정
      }))
    }));
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    const totalQuantity = updatedOptions.reduce((sum, option) => sum + option.quantity, 0);
    setFormData({ ...formData, options: updatedOptions, quantity: totalQuantity });
  };

  const handleOptionDetailChange = (index, name, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [name]: parseInt(value),
      status: name === 'quantity' && parseInt(value) > 0 ? '판매중' : '품절'
    };

    const totalQuantity = updatedOptions.reduce((sum, option) => sum + option.quantity, 0);

    setFormData({ ...formData, options: updatedOptions, quantity: totalQuantity });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, title, content, contentImages, quantity, productImages, price, status, type, sale, category, options } = formData;
    const itemData = new FormData();
    itemData.append('name', name);
    itemData.append('title', title);
    itemData.append('content', content);
    contentImages.forEach((image) => itemData.append('contentImages', image));
    productImages.forEach((image) => itemData.append('productImages', image));
    itemData.append('price', price);
    itemData.append('quantity', quantity);
    itemData.append('status', status);
    itemData.append('type', type);
    itemData.append('sale', sale);
    itemData.append('category', category);
    itemData.append('options', JSON.stringify(options)); // options를 JSON 문자열로 변환하여 추가

    console.log("FormData to be submitted: ", {
      name, title, content, quantity, price, status, type, sale, category, options
    });

    dispatch(addItem(itemData))
      .unwrap()
      .then((item) => {
        console.log('상품이 성공적으로 등록되었습니다.', item);
        setFormData({
          name: '',
          title: '',
          content: '',
          contentImages: [],
          productImages: [],
          price: 0,
          status: '',
          type: '',
          sale: 0,
          category: 'BASIC',
          options: [],
          quantity: 0,
        });
        setOptionInputs([{ optionName: '', optionValues: '' }]);
        navigate('/');
      })
      .catch((error) => {
        console.error('상품 등록 중 에러 발생:', error);
        alert('상품 등록 중 에러가 발생했습니다.');
      });
  };

  const onDragEnd = (result, field) => {
    if (!result.destination) return;
    const items = Array.from(formData[field]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData({ ...formData, [field]: items });
  };

  const renderFileList = (files, field) => (
    <DragDropContext onDragEnd={(result) => onDragEnd(result, field)}>
      <Droppable droppableId={field} direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="fileListContainer"
          >
            {files.map((file, index) => (
              <Draggable key={file.name} draggableId={file.name} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="fileListItem"
                  >
                    <img src={URL.createObjectURL(file)} alt={`preview-${index}`} className="filePreviewImage" />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  const renderOptionsTable = () => {
    const optionNames = [...new Set(optionInputs.map(input => input.optionName))];

    return (
      <table className='optionsTable'>
        <thead>
          <tr>
            {optionNames.map((name, index) => (
              <th key={index}>{name}</th>
            ))}
            <th>옵션가격</th>
            <th>재고수량</th>
            <th>판매 상태</th>
            <th>옵션 삭제</th>
          </tr>
        </thead>
        <tbody>
          {formData.options.map((option, index) => (
            <tr key={index}>
              {optionNames.map((name, idx) => (
                <td key={idx}>{option.optionAttributes[name]}</td>
              ))}
              <td><input type="number" value={option.optionPrice} onChange={(e) => handleOptionDetailChange(index, 'optionPrice', e.target.value)} /></td>
              <td><input type="number" value={option.quantity} onChange={(e) => handleOptionDetailChange(index, 'quantity', e.target.value)} /></td>
              <td>{option.quantity > 0 ? '판매중' : '품절'}</td>
              <td><button type="button" className="deleteButton" onClick={() => handleRemoveOption(index)}>옵션 삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className='itemRegContainor'>
      <form onSubmit={handleSubmit}>
        <h2 className='title1'>제품등록</h2>
        <JoinBox
          name="name"
          titleName={titleName[0]}
          value={formData.name}
          onChange={handleInputChange}
          placeholder='제품명을 입력 해주세요.'
        />

        <JoinBox
          name="sale"
          titleName={titleName[8]}
          value={formData.sale}
          onChange={handleInputChange}
          placeholder='세일 퍼센트를 입력 해주세요.'
        />

        <JoinBox
          type="file"
          id="productImages"
          name="productImages"
          titleName={titleName[4]}
          onChange={handleFileChange}
          placeholder='제품 이미지를 업로드 해주세요.'
          multiple
        />
        {renderFileList(formData.productImages, 'productImages')}

        <div className='selectBoxContainer'>
          <div className='titleBox2'>
            <p className='titletext'>{titleName[6]}</p>
          </div>
          <SelectBox
            label=""
            options={{ SOLD_OUT: 'Sold Out', ON_SALE: 'On Sale', DISCOUNT: 'Discount' }}
            onSelectChange={handleStatusChange}
          />
        </div>
        <div className='selectBoxContainer'>
          <div className='titleBox2'>
            <p className='titletext'>{titleName[7]}</p>
          </div>
          <SelectBox
            label=""
            options={{ TSHIRT: 'TSHIRT', GRIPTOK: 'GRIPTOK' }}
            onSelectChange={handleTypeChange}
          />
        </div>
        <div className='selectBoxContainer'>
          <div className='titleBox2'>
            <p className='titletext'>{titleName[9]}</p>
          </div>
          <SelectBox
            label=""
            options={{ BASIC: 'Basic', NEW: 'New', BEST: 'Best' }}
            onSelectChange={handleCategoryChange}
          />
        </div>
        <JoinBox
          name="title"
          titleName={titleName[1]}
          value={formData.title}
          onChange={handleInputChange}
          placeholder='제목을 입력 해주세요.'
        />
        <JoinBox
          type="text"
          name="price"
          titleName={titleName[5]}
          value={formatCurrency(formData.price)}
          onChange={handleInputChange}
          placeholder='가격을 입력 해주세요.'
        />
        <JoinBox
          name="content"
          titleName={titleName[2]}
          value={formData.content}
          onChange={handleInputChange}
          placeholder='내용을 입력 해주세요.'
          type="textarea"
        />
        <JoinBox
          type="file"
          id="contentImages"
          name="contentImages"
          titleName={titleName[3]}
          onChange={handleFileChange}
          placeholder='내용 이미지를 업로드 해주세요.'
          multiple
        />
        {renderFileList(formData.contentImages, 'contentImages')}

        <JoinBox
          name="quantity"
          titleName={titleName[10]}
          value={formData.quantity}
          readOnly
          type="text"
        />
        <div>
          <h3>옵션 추가</h3>
          {optionInputs.map((input, index) => (
            <div key={index}>
              <input
                type="text"
                name="optionName"
                placeholder="옵션명"
                value={input.optionName}
                onChange={(e) => handleOptionInputChange(index, e)}
              />
              <input
                type="text"
                name="optionValues"
                placeholder="옵션값 (쉼표로 구분)"
                value={input.optionValues}
                onChange={(e) => handleOptionInputChange(index, e)}
              />
              <button type="button" onClick={() => handleRemoveOptionInput(index)}>X</button>
            </div>
          ))}
          <button type="button" onClick={handleAddOptionInput}>옵션 추가</button>
          <button type="button" onClick={handleAddOptions}>옵션 목록으로 적용</button>
          {renderOptionsTable()}
        </div>

        <div className='FullWidthButton'>
          <FullWidthButton color="gray" text="제품등록" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
