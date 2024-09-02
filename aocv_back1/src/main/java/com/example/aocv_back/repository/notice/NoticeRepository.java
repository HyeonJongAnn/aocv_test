package com.example.aocv_back.repository.notice;

import com.example.aocv_back.entity.notice.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Integer>,NoticeRepositoryCustom {

}
