package com.example.aocv_back.service.notice;

import com.example.aocv_back.dto.notice.NoticeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoticeService {
    NoticeDTO createNotice(NoticeDTO noticeDTO);

    Page<NoticeDTO> getAllNotices(Pageable pageable, String searchCondition, String searchKeyword, String sort);

    NoticeDTO getNoticeDetail(Integer id);
    NoticeDTO updateNotice(NoticeDTO noticeDTO);
    void deleteNotice(Integer id);
}
