package com.example.aocv_back.entity.user;

import com.example.aocv_back.dto.user.UserDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "T_USER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SequenceGenerator(
        name = "UserSeqGenerator",
        sequenceName = "T_USER_SEQ",
        initialValue = 1,
        allocationSize = 1
)
public class User {
    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "UserSeqGenerator"
    )
    @Column(name = "user_seq")
    private Integer id;
    @Column(unique = true)
    private String userId;
    private String userPw;
    private String userAddress;
    private String userTel;
    private String userName;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private LocalDateTime userBirth;
    private String role;
    private LocalDateTime userRegDate;
    private boolean isActive;
    private LocalDateTime lastLoginDate;
    private String token;
    private int point; // 적립금 필드 추가

    public UserDTO toDTO() {
        return UserDTO.builder()
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
