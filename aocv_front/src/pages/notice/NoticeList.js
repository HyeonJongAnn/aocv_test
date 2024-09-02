import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getNoticeList } from '../../apis/noticeApi';
import SearchIcon from '@mui/icons-material/Search';
import '../../scss/pages/notice/NoticeList.scss';
import CustomPagination from '../../components/ui/CustomPagination';
import { change_searchCondition, change_searchKeyword, change_sort } from '../../slices/NoticeSlice';
import { NativeSelect } from '@mui/material';
import Input from '../../components/Input';
import { Button } from '@mui/base';
import SelectBox from '../../components/ui/SelectBox';

const NoticeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { noticeDTO, page, totalPages, loading, error, sort } = useSelector(state => state.notice);
  const searchCondition = useSelector(state => state.notice.searchCondition);
  const searchKeyword = useSelector(state => state.notice.searchKeyword) || '';

  const [selectedValue, setSelectedValue] = useState('latest');
  const [localSearchKeyword, setLocalSearchKeyword] = useState('');

  const fontSize = '13px';

  const options = {
    latest: '최신 등록순',
    oldest: '오래된순',
    update: '업데이트 순'
  };

  useEffect(() => {
    setLocalSearchKeyword(searchKeyword); // 검색 키워드를 로컬 상태에 설정
    dispatch(getNoticeList({
      searchCondition: 'all',
      searchKeyword: '',
      page: 0,
      sort: 'latest'
    }));
  }, [dispatch]);

  const changeSearchCondition = useCallback((e) => {
    dispatch(change_searchCondition(e.target.value));
  }, [dispatch]);

  const changeSearchKeyword = useCallback((e) => {
    setLocalSearchKeyword(e.target.value);
    dispatch(change_searchKeyword(e.target.value));
  }, []);

  const search = useCallback((e) => {
    e.preventDefault();

    const condition = 'all';
    const keyword = localSearchKeyword.trim() === '' ? '' : localSearchKeyword;

    dispatch(
      getNoticeList({
        searchCondition: condition,
        searchKeyword: keyword,
        page: 0,
        sort: selectedValue
      })
    );
    dispatch(change_searchKeyword(keyword));
  }, [dispatch, localSearchKeyword, selectedValue]);

  const handleSelectChange = useCallback((selectedOption) => {
    const value = selectedOption.key;
    setSelectedValue(value);
    dispatch(change_sort(value));

    const condition = 'all';
    const keyword = localSearchKeyword.trim() === '' ? '' : localSearchKeyword;

    dispatch(
      getNoticeList({
        searchCondition: condition,
        searchKeyword: keyword,
        page: 0,
        sort: value
      })
    );
  }, [dispatch, localSearchKeyword]);

  const changePage = useCallback((e, v) => {
    const condition = 'all';
    const keyword = localSearchKeyword.trim() === '' ? '' : localSearchKeyword;
    const currentSort = selectedValue;

    dispatch(
      getNoticeList({
        searchCondition: condition,
        searchKeyword: keyword,
        page: parseInt(v) - 1,
        sort: currentSort
      })
    );
  }, [dispatch, localSearchKeyword, selectedValue]);

  const handleImageClick = (id) => {
    navigate(`/notice/${id}`);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error}</p>;

  return (
    <div className="notice-list-container">
      <form onSubmit={search}>
        <div className='review_box'>
          <SearchIcon id={'SearchIcon'} />
          <NativeSelect
            defaultValue={searchCondition}
            inputProps={{
              name: 'searchCondition'
            }}
            fullWidth
            onChange={changeSearchCondition}
            style={{ display: 'none' }}
          >
            <option value='all'>전체</option>
            <option value='name'>이름</option>
            <option value='type'>제품유형</option>
          </NativeSelect>
          <Input
            id={'Input'}
            color={'gray'}
            placeholder={'검색'}
            name={'searchKeyword'}
            value={localSearchKeyword}
            onChange={changeSearchKeyword}
          />
          <Button
            color='primary'
            type='submit'
            style={{ display: 'none' }}>
            검색
          </Button>
          <div className='SelectBox'>
            <SelectBox
              options={options}
              onSelectChange={handleSelectChange}
              fontSize={fontSize}
              placeholder="최신 등록순"
              value={selectedValue} // selectedValue에 맞는 텍스트 표시
            />
          </div>
        </div>
        <div className='noticeImgBox'>
          {(noticeDTO && noticeDTO.length > 0) ? (
            noticeDTO.map((notice, index) => (
              <div className="notice-item" key={index}>
                <div className="notice-image" onClick={() => handleImageClick(notice.id)}>
                  {notice.imageUrls && notice.imageUrls.length > 0 ? (
                    <img src={notice.imageUrls[0]} alt={notice.title} onError={(e) => { e.target.src = '/path/to/default-image.jpg'; }} />
                  ) : (
                    <img src='/path/to/default-image.jpg' alt='default' />
                  )}
                </div>
                <div className="notice-content">
                  <h3>{notice.title}</h3>
                  <p>{notice.content}</p>
                  <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p>공지사항이 없습니다.</p>
          )}
        </div>
        <div className="pagination-container">
          <CustomPagination total={totalPages} page={page + 1} changePage={changePage} />
        </div>
      </form>
    </div>
  );
};

export default NoticeList;
