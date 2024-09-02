package com.example.aocv_back.controller.user;

import com.example.aocv_back.dto.ResponseDTO;
import com.example.aocv_back.dto.user.UserDTO;
import com.example.aocv_back.entity.user.User;
import com.example.aocv_back.jwt.JwtTokenProvider;
import com.example.aocv_back.service.user.UserService;
import com.example.aocv_back.service.user.impl.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.example.aocv_back.findpw.PasswordGenerator.generateRandomPassword;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody UserDTO userDTO) {
        ResponseDTO<UserDTO> responseDTO = new ResponseDTO<>();
        try {
            userDTO.setActive(true);
            userDTO.setLastLoginDate(LocalDateTime.parse(LocalDateTime.now().toString()));
            userDTO.setUserRegDate(LocalDateTime.parse(LocalDateTime.now().toString()));
            userDTO.setRole("ROLE_USER");
            userDTO.setUserPw(passwordEncoder.encode(userDTO.getUserPw()));
            userDTO.setPoint(1000); // 회원가입 시 적립금 1000 포인트 설정

            UserDTO signupUserDTO = userService.signup(userDTO);

            signupUserDTO.setUserPw("");

            responseDTO.setItem(signupUserDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            if (e.getMessage().equalsIgnoreCase("User already exists")) {
                responseDTO.setErrorCode(100);
                responseDTO.setErrorMessage("User already exists");
            } else if (e.getMessage().equalsIgnoreCase("id is required")) {
                responseDTO.setErrorCode(101);
                responseDTO.setErrorMessage(e.getMessage());
            } else if (e.getMessage().equalsIgnoreCase("password is required")) {
                responseDTO.setErrorCode(102);
                responseDTO.setErrorMessage(e.getMessage());
            } else if (e.getMessage().equalsIgnoreCase("name is required")) {
                responseDTO.setErrorCode(103);
                responseDTO.setErrorMessage(e.getMessage());
            } else {
                responseDTO.setErrorCode(104);
                responseDTO.setErrorMessage(e.getMessage());
            }
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signin(@RequestBody UserDTO userDTO) {
        ResponseDTO<UserDTO> responseDTO = new ResponseDTO<>();
        try {
            UserDTO signinUserDTO = userService.signin(userDTO);
            responseDTO.setItem(signinUserDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            if (e.getMessage().equalsIgnoreCase("not exist userid")) {
                responseDTO.setErrorCode(105);
                responseDTO.setErrorMessage(e.getMessage());
            } else if (e.getMessage().equalsIgnoreCase("wrong password")) {
                responseDTO.setErrorCode(106);
                responseDTO.setErrorMessage(e.getMessage());
            } else {
                responseDTO.setErrorCode(107);
                responseDTO.setErrorMessage(e.getMessage());
            }

            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/sign-out")
    public ResponseEntity<?> signout() {
        ResponseDTO<Map<String, String>> responseDTO = new ResponseDTO<>();

        try {
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(null);
            SecurityContextHolder.setContext(securityContext);

            Map<String, String> msgMap = new HashMap<>();

            msgMap.put("signoutMsg", "signout success");

            responseDTO.setItem(msgMap);
            responseDTO.setStatusCode(HttpStatus.OK.value());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(108);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/check-userid")
    public ResponseEntity<ResponseDTO<Map<String, Object>>> checkUserId(@RequestParam("userId") String userId) {
        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>();

        try {
            boolean available = userService.isUserIdAvailable(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("available", available);


            responseDTO.setItem(response);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(109);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/find-id")
    public ResponseEntity<ResponseDTO<Map<String, Object>>> findId(@RequestParam("userName") String userName,
                                                                   @RequestParam("userTel") String userTel) {
        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>();
        try {
            UserDTO userDTO = userService.findId(userName, userTel);
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userDTO.getUserId());

            responseDTO.setItem(response);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(110);
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/find-pw")
    public ResponseEntity<?> findPw(@RequestParam String userId,
                                    @RequestParam String userName,
                                    @RequestParam String userTel) {
        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>();
        String temporaryPassword = generateRandomPassword(8);
        try {
            UserDTO userDTO = userService.findPw(userId, userName, userTel);
            Map<String, Object> response = new HashMap<>();
            response.put("tempPassword", temporaryPassword);
            response.put("msg", "change password success");
            userDTO.setUserPw(passwordEncoder.encode(temporaryPassword));
            userService.saveUser(userDTO.toEntity());

            responseDTO.setItem(response);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(111);
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PutMapping("/modify/{userId}")
    public ResponseEntity<ResponseDTO<UserDTO>> modify(@PathVariable("userId") String userId, @RequestBody UserDTO userDTO) {
        ResponseDTO<UserDTO> responseDTO = new ResponseDTO<>();
        try {
            Optional<User> existingUser = userService.findById(userId);

            if (existingUser.isEmpty()) {
                throw new Exception("User not found");
            }

            UserDTO updatedUser = userService.modify(userId, userDTO);

            responseDTO.setItem(updatedUser);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (IllegalArgumentException e) {
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(112);
            return ResponseEntity.badRequest().body(responseDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(113);
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<ResponseDTO<Map<String, Object>>> deleteUser(@AuthenticationPrincipal UserDetails userDetails) {
        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>();
        try {
            Map<String, Object> response = new HashMap<>();
            String username = userDetails.getUsername();
            userService.deleteUser(username);
            response.put("redirectUrl", "/");
            responseDTO.setItem(response);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(114);
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/check-password")
    public ResponseEntity<ResponseDTO<Map<String, Object>>> checkPassword(@RequestParam("curUserPw") String userPw,
                                                                          @RequestParam("userId") String userId) {
        ResponseDTO<Map<String, Object>> responseDTO = new ResponseDTO<>();
        try {
            Map<String, Object> response = new HashMap<>();
            userService.checkPassword(userPw, userId);
            response.put("checkPasswordMsg", "success");
            responseDTO.setItem(response);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(115);
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/get-address")
    public ResponseEntity<?> getUserAddress(@AuthenticationPrincipal UserDetails userDetails) {
        ResponseDTO<UserDTO> responseDTO = new ResponseDTO<>();
        try {
            String userId = userDetails.getUsername();
            System.out.println(userId);
            UserDTO userDTO = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found")).toDTO();
            System.out.println(userDTO);
            responseDTO.setItem(userDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(116); // 새로운 에러 코드 추가
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PutMapping("/update-address")
    public ResponseEntity<?> updateUserAddress(@RequestBody UserDTO userDTO, @AuthenticationPrincipal UserDetails userDetails) {
        ResponseDTO<UserDTO> responseDTO = new ResponseDTO<>();
        try {
            String userId = userDetails.getUsername();
            userDTO.setUserId(userId);
            UserDTO updatedUserDTO = userService.updateUserAddress(userDTO);
            responseDTO.setItem(updatedUserDTO);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            responseDTO.setErrorMessage(e.getMessage());
            responseDTO.setErrorCode(117); // 새로운 에러 코드 추가
            responseDTO.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/points")
    public ResponseEntity<Integer> getUserPoints(@RequestParam Integer id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user.getPoint());
    }
}
