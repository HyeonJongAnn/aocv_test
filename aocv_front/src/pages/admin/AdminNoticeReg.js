import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotice } from '../../apis/noticeApi';
import '../../scss/pages/admin/AdminNoticeReg.scss';
import JoinBox from '../../components/JoinBox';
import Button2 from '../../components/button/Button2';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AdminNoticeReg = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const loading = useSelector(state => state.notice.loading);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await dispatch(addNotice(formData)).unwrap();
      setTitle('');
      setContent('');
      setImages([]);
    } catch (error) {
      console.error('Error adding notice:', error);
    }
  };

  return (
    <div className="noticeRegContainer">
      <h2>공지사항 등록</h2>
      <form onSubmit={handleSubmit}>
        <div className='regTextBox1'>
          <JoinBox
            id={"title"}
            name={"title"}
            value={title}
            showButtonBox={false}
            onChange={handleTitleChange}
            placeholder={'제목을 입력 해주세요.'}
          />
        </div>
        
        <div className='regTextBox4'>
          <JoinBox
            id={"file"}
            name={"file"}
            type={"file"}
            multiple
            showButtonBox={false}
            onChange={handleFileChange}
          />
        </div>

        <div className='regTextBox4'>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div className="fileListContainer"
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  style={{ overflow: 'auto' }}>
                  {images.map((file, index) => (
                    <Draggable key={file.name} draggableId={file.name} index={index}>
                      {(provided) => (
                        <div className="fileListItem" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <img src={URL.createObjectURL(file)} alt={file.name} className="filePreviewImage" />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className='regTextBox2'>
          <textarea
            value={content}
            onChange={handleContentChange}
            className='regContent'
            placeholder='내용을 입력 해주세요.'
          />
        </div>

        <Button2
          text={loading ? "등록 중..." : "등록"}
          color={"thickgray"}
          type="submit"
          className="modal-button"
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default AdminNoticeReg;
