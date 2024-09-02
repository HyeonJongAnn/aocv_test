package com.example.aocv_back.repository.notice.impl;

import com.example.aocv_back.entity.notice.Notice;
import com.example.aocv_back.repository.notice.NoticeRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.aocv_back.entity.item.QItem.item;
import static com.example.aocv_back.entity.notice.QNotice.notice;

@Repository
@RequiredArgsConstructor
public class NoticeRepositoryCustomImpl implements NoticeRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;
    @Override
    public Page<Notice> searchAll(Pageable pageable, String searchCondition, String searchKeyword, String sort) {
        BooleanBuilder searchPredicate = getSearch(searchCondition, searchKeyword);
        OrderSpecifier<?> orderSpecifier = getOrderSpecifier(sort);

        List<Notice> noticeList = jpaQueryFactory
                .selectFrom(notice)
                .where(searchPredicate)
                .orderBy(orderSpecifier)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long totalCnt = jpaQueryFactory
                .select(notice.count())
                .where(searchPredicate)
                .from(notice)
                .fetchOne();


        return new PageImpl<>(noticeList, pageable, totalCnt);
    }

    private BooleanBuilder getSearch(String searchCondition, String searchKeyword) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();

        if (searchKeyword != null && !searchKeyword.isEmpty()) {
            if ("all".equalsIgnoreCase(searchCondition)) {
                booleanBuilder.or(notice.title.containsIgnoreCase(searchKeyword))
                        .or(notice.content.stringValue().containsIgnoreCase(searchKeyword));
            } else if ("title".equalsIgnoreCase(searchCondition)) {
                booleanBuilder.and(notice.title.containsIgnoreCase(searchKeyword));
            } else if ("content".equalsIgnoreCase(searchCondition)) {
                booleanBuilder.and(notice.content.stringValue().containsIgnoreCase(searchKeyword));
            }
        }

        return booleanBuilder;
    }
    private OrderSpecifier<?> getOrderSpecifier(String sort) {
        if (sort == null) {
            return item.createdAt.desc();
        }
        switch (sort) {
            case "latest":
                return notice.createdAt.desc();
            case "oldest":
                return notice.createdAt.asc();
            case "update":
                return notice.updatedAt.desc();
            default:
                return notice.createdAt.desc();
        }
    }

}
