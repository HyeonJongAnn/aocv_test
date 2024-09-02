import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { modifyNotice } from '../../apis/noticeApi';
import JoinBox from '../../components/JoinBox';
import FullWidthButton from '../../components/button/FullWidthButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import '../../scss/pages/notice/NoticeModify.scss';

const NoticeModify = ({ notice, closeModal }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: notice.id,
    title: notice.title,
    content: notice.content,
    images: [],
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: notice.imageUrls.map((url) => ({ url }))
    }));
  }, [notice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, title, content, images } = formData;
    const noticeData = new FormData();
    noticeData.append('id', id);
    noticeData.append('title', title);
    noticeData.append('content', content);
    images.forEach((img) => {
      if (img.file) noticeData.append('images', img.file);
      else noticeData.append('existingImages', img.url);
    });

    dispatch(modifyNotice(noticeData))
      .unwrap()
      .then(() => {
        console.log('공지사항이 성공적으로 수정되었습니다.');
        closeModal();
      })
      .catch((error) => {
        console.error('공지사항 수정 중 에러 발생:', error);
        alert('공지사항 수정 중 에러가 발생했습니다.');
      });
  };

  const removeFile = (index) => {
    setFormData((prevFormData) => {
      const newFiles = Array.from(prevFormData.images);
      newFiles.splice(index, 1);
      return { ...prevFormData, images: newFiles };
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData({ ...formData, images: items });
  };

  const renderFileList = (files) => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="images" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="fileListContainer"
            style={{ overflow: 'auto' }}
          >
            {files.map((file, index) => (
              <Draggable
                key={file.file ? file.file.name : file.url}
                draggableId={file.file ? file.file.name : file.url}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`fileListItem ${snapshot.isDragging ? 'dragging' : ''}`}
                  >
                    {file.file ? (
                      <img
                        src={URL.createObjectURL(file.file)}
                        alt={`preview-${index}`}
                        className="filePreviewImage"
                      />
                    ) : (
                      <img
                        src={file.url}
                        alt={`preview-${index}`}
                        className="filePreviewImage"
                      />
                    )}
                    <button type="button" onClick={() => removeFile(index)}>
                      X
                    </button>
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

  return (
    <Modal isOpen={true} onRequestClose={closeModal} className="noticeModifyModal">
      <div className='noticeRegContainor'>
        <form onSubmit={handleSubmit}>
          <h2 className='title1'>공지사항 수정</h2>
          <JoinBox
            name="title"
            titleName="제목"
            value={formData.title}
            onChange={handleInputChange}
            placeholder='제목을 입력 해주세요.'
          />
          <JoinBox
            name="content"
            titleName="내용"
            value={formData.content}
            onChange={handleInputChange}
            placeholder='내용을 입력 해주세요.'
            type="textarea"
          />
          <JoinBox
            type="file"
            id="images"
            name="images"
            titleName="이미지"
            onChange={handleFileChange}
            placeholder='이미지를 업로드 해주세요.'
            multiple
          />
          {renderFileList(formData.images)}

          <div className='FullWidthButton'>
            <FullWidthButton color="gray" text="공지사항 수정" type="submit" />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NoticeModify;
