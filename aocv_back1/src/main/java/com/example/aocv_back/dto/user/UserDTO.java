package com.example.aocv_back.dto.user;

import com.example.aocv_back.entity.user.Gender;
import com.example.aocv_back.entity.user.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class UserDTO {
    private Integer id;
    private String userId;
    private String userPw;
    private String userAddress;
    private String userTel;
    private String userName;
    private Gender gender;
    private LocalDateTime userBirth;
    private String role;
    private LocalDateTime userRegDate;
    private boolean isActive;
    private LocalDateTime lastLoginDate;
    private String token;
    private String curUserPw;
    private int point; // 적립금 필드 추가

    public User toEntity() {
        return User.builder()
                .id(this.id)
                .userId(this.userId)
                .userPw(this.userPw)
                .userAddress(this.userAddress)
                .userTel(this.userTel)
                .userName(this.userName)
                .gender(this.gender)
                .userBirth(LocalDateTime.parse(this.userBirth.toString()))
                .role(this.role)
                .userRegDate(LocalDateTime.parse(this.userRegDate.toString()))
                .isActive(this.isActive)
                .lastLoginDate(LocalDateTime.parse(this.lastLoginDate.toString()))
                .point(this.point) // 적립금 필드 추가
                .build();
    }
}
