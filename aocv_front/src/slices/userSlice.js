import { createSlice } from "@reduxjs/toolkit";
import { signup, signin, signout, deleteUser, getUserAddress, updateUserAddress, getUserPoints } from "../apis/userApi";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    loginUserId: '',
    loginUserName: '',
    loginUserTel: '',
    loginUserAddress: '',
    loginUserRole: '',
    loginUser: '',
    loginUserPoint:'',
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLogin = true;
      state.loginUserId = action.payload.userId;
      state.loginUserName = action.payload.userName;
      state.loginUserTel = action.payload.userTel;
      state.loginUserAddress = action.payload.userAddress;
      state.loginUserRole = action.payload.role;
      state.loginUser = action.payload.id;
      state.loginUserPoint = action.payload.point;
      sessionStorage.removeItem('orderInfo'); 
    },
    clearState: (state) => {
      state.isLogin = false;
      state.loginUserId = "";
      state.loginUserName = "";
      state.loginUserTel = "";
      state.loginUserAddress = "";
      state.loginUserPw = "";
      state.deleteStatus = "idle";
      state.deleteError = null;
      state.loginUserRole = "";
      state.loginUser = "";
      state.loginUserPoint = "";
      sessionStorage.removeItem('orderInfo'); 
    },
    updateUserSuccess: (state, action) => {
      state.loginUserName = action.payload.userName;
      state.loginUserTel = action.payload.userTel;
      state.loginUserAddress = action.payload.userAddress;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      alert("회원가입을 축하합니다.");
      window.location.href = "/user/sign-in";
    });
    builder.addCase(signup.rejected, (state, action) => {
      alert(`회원가입에 실패하셨습니다. 다시 시도해주세요.`);
    });
    builder.addCase(signin.fulfilled, (state, action) => {
      sessionStorage.setItem("ACCESS_TOKEN", action.payload.token);
      sessionStorage.removeItem('orderInfo');
      alert("로그인이 성공적으로 되었습니다.");
      state.isLogin = true;
      state.loginUserId = action.payload.userId;
      state.loginUserName = action.payload.userName;
      state.loginUserTel = action.payload.userTel;
      state.loginUserAddress = action.payload.userAddress;
      state.loginUserRole = action.payload.role;
      state.loginUser = action.payload.id;
      state.loginUserPoint = action.payload.point;
    });
    builder.addCase(signin.rejected, (state, action) => {
      const errorMessage = "아이디 또는 비밀번호가 틀렸습니다. 다시 입력해주세요.";
      window.location.replace("/user/sign-in");
      alert(errorMessage);
    });
    builder.addCase(signout.fulfilled, (state, action) => {
      if (action.payload.success) {
        sessionStorage.removeItem("ACCESS_TOKEN");
        sessionStorage.removeItem('orderInfo');
        state.isLogin = false;
        state.loginUserId = "";
        state.loginUserName = '';
        state.loginUserTel = '';
        state.loginUserAddress = '';
        state.loginUserRole = '';
        state.loginUser = '';
        state.loginUserPoint = "";
      }
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
      state.isLogin = false;
      state.loginUserId = "";
      state.loginUserName = "";
      state.loginUserTel = "";
      state.loginUserAddress = "";
      state.loginUserPw = "";
      state.loginUserRole = "";
      state.loginUser = "";
      state.loginUserPoint = "";
      sessionStorage.removeItem("ACCESS_TOKEN");
      sessionStorage.removeItem('orderInfo');
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.deleteStatus = "failed";
      state.deleteError = action.error.message;
    });
    builder.addCase(getUserAddress.fulfilled, (state, action) => {
      const user = action.payload.item;
      state.loginUserName = user.userName;
      state.loginUserTel = user.userTel;
      state.loginUserAddress = user.userAddress;
    });
    builder.addCase(getUserAddress.rejected, (state, action) => {
      console.log(action.payload);
      alert("사용자 정보 가져오기 실패");
    });
    builder.addCase(updateUserAddress.fulfilled, (state, action) => {
      const user = action.payload.item;
      state.loginUserName = user.userName;
      state.loginUserTel = user.userTel;
      state.loginUserAddress = user.userAddress;
      alert("사용자 정보가 성공적으로 업데이트되었습니다.");
    });
    builder.addCase(updateUserAddress.rejected, (state, action) => {
      alert("사용자 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
    });
    builder.addCase(getUserPoints.fulfilled, (state, action) => {
      state.loginUserPoint = action.payload; 
      console.log(action.payload)
    });
    builder.addCase(getUserPoints.rejected, (state, action) => {
      console.log(action.payload);
      alert("적립금 가져오기 실패");
    });
  },
});

export const { clearState, loginSuccess, updateUserSuccess } = userSlice.actions;
export default userSlice.reducer;