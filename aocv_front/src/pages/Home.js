import React, { useCallback, useEffect, useState } from 'react';
import '../scss/Home.scss';
import SearchIcon from '@mui/icons-material/Search';
import { Button, NativeSelect } from '@mui/material';
import Input from '../components/Input';
import SelectBox from '../components/ui/SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../../src/apis/itemApi';
import { change_searchCondition, change_searchKeyword, change_sort } from '../slices/ItemSlice';
import CustomPagination from '../components/ui/CustomPagination';
import ItemListContentList from '../components/item/ItemListContentList';

const Home = () => {
  const fontSize = '13px';
  const [selectedValue, setSelectedValue] = useState('latest');
  const [localSearchKeyword, setLocalSearchKeyword] = useState('');
  const dispatch = useDispatch();
  const item = useSelector(state => state.item.itemDTO);
  const searchCondition = useSelector(state => state.item.searchCondition);
  const searchKeyword = useSelector(state => state.item.searchKeyword) || '';
  const page = useSelector(state => state.item.page);
  const sort = useSelector(state => state.item.sort);
  const options = {
    latest: '최신 등록순',
    oldest: '오래된순',
    highPrice: '가격 높은순',
    lowPrice: '가격 낮은순'
  };

  useEffect(() => {
    setLocalSearchKeyword(searchKeyword); 
    dispatch(getItem({
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
  }, [dispatch]);

  const search = useCallback((e) => {
    e.preventDefault();

    const condition = 'all'; 
    const keyword = localSearchKeyword.trim() === '' ? '' : localSearchKeyword; 

    dispatch(
      getItem({
        searchCondition: condition,
        searchKeyword: keyword,
        page: 0,
        sort: selectedValue 
      })
    );
  }, [dispatch, localSearchKeyword, selectedValue]);

  const handleSelectChange = useCallback((selectedOption) => {
    const value = selectedOption.key;
    setSelectedValue(value);
    dispatch(change_sort(value));

    const condition = 'all';
    const keyword = localSearchKeyword.trim() === '' ? '' : localSearchKeyword;

    dispatch(
      getItem({
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
      getItem({
        searchCondition: condition,
        searchKeyword: keyword,
        page: parseInt(v) - 1,
        sort: currentSort
      })
    );
  }, [dispatch, localSearchKeyword, selectedValue]); 

  const sortItems = (items) => {
    if (!items) return []; // items가 undefined일 경우 빈 배열 반환
    return items.slice().sort((a, b) => {
      if ((a.category === 'BEST' || a.category === 'NEW') && (b.category !== 'BEST' && b.category !== 'NEW')) {
        return -1;
      }
      if ((b.category === 'BEST' || b.category === 'NEW') && (a.category !== 'BEST' && a.category !== 'NEW')) {
        return 1;
      }
      return 0;
    });
  };

  return (
    <>
      <div className='reviewList_container'>
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
              />
            </div>
          </div>
          {item && item.content && <ItemListContentList items={sortItems(item.content)} />}
          <div className='CustomPagination'>
            {item && <CustomPagination total={item.totalPages} page={page + 1} changePage={changePage} />}
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
