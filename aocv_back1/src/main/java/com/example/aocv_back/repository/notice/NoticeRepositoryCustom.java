package com.example.aocv_back.repository.notice;

import com.example.aocv_back.entity.notice.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoticeRepositoryCustom {
    Page<Notice> searchAll(Pageable pageable, String searchCondition, String searchKeyword, String sort);
}
