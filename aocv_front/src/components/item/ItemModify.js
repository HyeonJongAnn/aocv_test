import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemDetail, modifyItem } from '../../apis/itemApi';
import JoinBox from '../../components/JoinBox';
import SelectBox from '../../components/ui/SelectBox';
import '../../scss/pages/item/ItemModify.scss';
import FullWidthButton from '../../components/button/FullWidthButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ItemModify = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = useSelector(state => state.item.currentItem);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    contentImages: [],
    productImages: [],
    price: 0,
    status: '',
    type: '',
    sale: 0,
    category: '',
    options: [],
    quantity: 0,
  });

  useEffect(() => {
    if (id) {
      dispatch(getItemDetail(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        title: item.title,
        content: item.content,
        contentImages: item.contentImages.map((url) => ({ url })),
        productImages: item.productImages.map((url) => ({ url })),
        price: item.price,
        status: item.status,
        type: item.type,
        sale: item.sale,
        category: item.category,
        options: item.options,
        quantity: item.quantity,
      });
    }
  }, [item]);

  const titleName = ['제품명', '제목', '내용', '내용 이미지', '제품 이미지', '가격', '제품 상태', '제품 유형', '세일 퍼센트', '카테고리', '재고수량'];

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
    const newFiles = Array.from(files).map(file => ({ file }));

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

  const handleRemoveOption = (index) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    const totalQuantity = updatedOptions.reduce((sum, option) => sum + option.quantity, 0);
    setFormData({ ...formData, options: updatedOptions, quantity: totalQuantity });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, name, title, content, contentImages, productImages, price, status, type, sale, category, options } = formData;
    const itemData = new FormData();
    itemData.append('id', id);
    itemData.append('name', name);
    itemData.append('title', title);
    itemData.append('content', content);
    contentImages.forEach((img) => {
      if (img.file) itemData.append('contentImages', img.file);
      else itemData.append('existingContentImages', img.url);
    });
    productImages.forEach((img) => {
      if (img.file) itemData.append('productImages', img.file);
      else itemData.append('existingProductImages', img.url);
    });
    itemData.append('price', price);
    itemData.append('quantity', formData.quantity);
    itemData.append('status', status);
    itemData.append('type', type);
    itemData.append('sale', sale);
    itemData.append('category', category);
    itemData.append('options', JSON.stringify(options));

    dispatch(modifyItem(itemData))
      .unwrap()
      .then(() => {
        console.log('상품이 성공적으로 수정되었습니다.');
        navigate('/');
      })
      .catch((error) => {
        console.error('상품 수정 중 에러 발생:', error);
        alert('상품 수정 중 에러가 발생했습니다.');
      });
  };

  const removeFile = (field, index) => {
    setFormData((prevFormData) => {
      const newFiles = Array.from(prevFormData[field]);
      newFiles.splice(index, 1);
      return { ...prevFormData, [field]: newFiles };
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
              <Draggable key={file.file ? file.file.name : file.url} draggableId={file.file ? file.file.name : file.url} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`fileListItem ${snapshot.isDragging ? 'dragging' : ''}`}
                  >
                    {file.file ? (
                      <img src={URL.createObjectURL(file.file)} alt={`preview-${index}`} className="filePreviewImage" />
                    ) : (
                      <img src={file.url} alt={`preview-${index}`} className="filePreviewImage" />
                    )}
                    <button type="button" onClick={() => removeFile(field, index)}>X</button>
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
    const optionNames = Object.keys(formData.options[0]?.optionAttributes || {});

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
        <h2 className='title1'>제품 수정</h2>
        <JoinBox
          name="name"
          titleName={titleName[0]}
          value={formData.name}
          onChange={handleInputChange}
          placeholder='제품명을 입력 해주세요.'
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
            selectedKey={formData.status}
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
            selectedKey={formData.type}
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
            selectedKey={formData.category}
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

        {renderOptionsTable()}

        <div className='FullWidthButton'>
          <FullWidthButton color="gray" text="제품수정" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default ItemModify;
