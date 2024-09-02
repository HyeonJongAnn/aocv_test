import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './pages/ui/Header';
import Home from './pages/Home';
import Footer from './pages/ui/Footer';
import SignIn from './pages/user/SignIn';
import SignUp from './pages/user/SignUp';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import FindId from './pages/user/FindId';
import FindPassword from './pages/user/FindPassword';
import MyPage from './pages/user/MyPage';
import KakaoLogin from './pages/user/KakaoLogin';
import NaverLogin from './pages/user/NaverLogin';
import GoogleLogin from './pages/user/GoogleLogin';
import Cart from './pages/cart/Cart';
import AdminPage from './pages/admin/AdminPage';
import Order from './pages/order/Order';
import PrivateRoute from './components/PrivateRoute';
import ItemDetail from './pages/item/ItemDetail';
import OrderList from './pages/order/OrderList';
import ReviewReg from './pages/reivew/ReviewReg';
import ItemModify from './components/item/ItemModify';
import ReviewListContentItem from './pages/reivew/ReviewListContentItem';
import AdminHome from './pages/admin/AdminHome';
import AdminReview from './pages/admin/AdminReview';
import AdminNoticeReg from './pages/admin/AdminNoticeReg';
import NoticeList from './pages/notice/NoticeList';
import TossPaymentsSuccess from './pages/order/TossPaymentsSuccess';
import TossPayementsFail from './pages/order/TossPayementsFail';
import OrderSuccess from './pages/order/OrderSuccess';
import NoticeDetail from './pages/notice/NoticeDetail';
import NoticeModify from './pages/notice/NoticeModify';
import OrderDetail from './pages/order/OrderDetail';
import OrderRefund from './pages/order/OrderRefund';
import OrderRefundList from './pages/order/OrderRefundList';
import About from './pages/ui/About';
import AdminUser from './pages/admin/AdminUser';
import TrackingForm from './pages/order/TrackingForm';

export let persiststore = persistStore(store);

function App() {

  return (
    <>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persiststore}>
      <div className="App">
        <Header className="Header" />
        <div className="Main">
          <div className="Content">
            <Routes>
              {/* user */}
              <Route path='/oauth/kakao' element={<KakaoLogin/>}></Route>
              <Route path='/oauth/naver' element={<NaverLogin/>}></Route>
              <Route path='/oauth/google' element={<GoogleLogin/>}></Route>
              <Route path='/user/find-id' element={<FindId/>}></Route>
              <Route path='/user/sign-in' element={<SignIn/>}></Route>
              <Route path='/user/sign-up' element={<SignUp/>}></Route>
              <Route path='/user/find-pw' element={<FindPassword/>}></Route>
              <Route path='/user/mypage' element={<MyPage/>}></Route>
              <Route path='/user/cart' element={<Cart/>}></Route>
              <Route path='/admin' element={<AdminPage/>}></Route>
              <Route path='/user/order' element={<Order/>}></Route>
              <Route path='/user/order-list' element={<OrderList/>}></Route>
              <Route path='/success' element={<TossPaymentsSuccess />} />
              <Route path='/fail' element={<TossPayementsFail />} />
              <Route path='/order-success' element={<OrderSuccess />} />
              <Route path='/user/orderdetail/:orderId' element={<OrderDetail />} />
              <Route path='/order/orderrefund' element={<OrderRefund />} />
              <Route path='/user/orderrefund-list' element={<OrderRefundList />} />
              <Route path='/about' element={<About />} />
              <Route path='/shipment' element={<TrackingForm />} />
              {/* main */}
              <Route path="/" element={<Home />}></Route>
              
                  {/* admin */}
                  <Route path="/admin" element={<PrivateRoute role="ROLE_ADMIN"><AdminPage /></PrivateRoute>} />
                  <Route path="/admin/item/modify/:id" element={<PrivateRoute role="ROLE_ADMIN"><ItemModify /></PrivateRoute>} />
                  <Route path="/admin/delete/:itemId" element={<PrivateRoute role="ROLE_ADMIN"><ItemDetail /></PrivateRoute>} />
                  <Route path="/admin/home" element={<PrivateRoute role="ROLE_ADMIN"><AdminHome /></PrivateRoute>} />
                  <Route path="/admin/review/list" element={<PrivateRoute role="ROLE_ADMIN"><AdminReview /></PrivateRoute>} />
                  <Route path="/notice/create" element={<PrivateRoute role="ROLE_ADMIN"><AdminNoticeReg /></PrivateRoute>} />
                  <Route path="/admin/user" element={<PrivateRoute role="ROLE_ADMIN"><AdminUser /></PrivateRoute>} />

                  {/* item */}
                  <Route path="/item/:id" element={<ItemDetail />} />
                  <Route path="/item/random-items" element={<ItemDetail />} />
                  <Route path="/review/add-review" element={<ReviewReg />} />
                  <Route path="/review/item/:itemId" element={<ReviewReg />} />
                  <Route path="/review/delete/:reviewId" element={<ReviewListContentItem />} />

                  {/* notice */}
                  <Route path="/notice/list" element={<NoticeList />} />
                  <Route path="/notice/:id" element={<NoticeDetail />} />
                  <Route path="/notice/modify" element={<PrivateRoute role="ROLE_ADMIN"><NoticeModify /></PrivateRoute>} />

                  {/* Purchase */}

                  {/* Sales */}

                </Routes>
              </div>
            </div>
            <Footer className="Footer" />
          </div>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;

