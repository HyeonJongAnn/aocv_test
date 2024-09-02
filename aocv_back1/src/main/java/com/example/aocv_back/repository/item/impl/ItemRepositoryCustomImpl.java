package com.example.aocv_back.repository.item.impl;

import com.example.aocv_back.entity.item.Item;
import com.example.aocv_back.repository.item.ItemRepositoryCustom;
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

@Repository
@RequiredArgsConstructor
public class ItemRepositoryCustomImpl implements ItemRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Page<Item> searchAll(Pageable pageable, String searchCondition, String searchKeyword, String sort) {
        BooleanBuilder searchPredicate = getSearch(searchCondition, searchKeyword);
        OrderSpecifier<?> orderSpecifier = getOrderSpecifier(sort);

        List<Item> itemList = jpaQueryFactory
                .selectFrom(item)
                .where(searchPredicate)
                .orderBy(orderSpecifier)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long totalCnt = jpaQueryFactory
                .select(item.count())
                .where(searchPredicate)
                .from(item)
                .fetchOne();



        return new PageImpl<>(itemList, pageable, totalCnt);
    }

    private BooleanBuilder getSearch(String searchCondition, String searchKeyword) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();

        if (searchKeyword != null && !searchKeyword.isEmpty()) {
            if ("all".equalsIgnoreCase(searchCondition)) {
                booleanBuilder.or(item.name.containsIgnoreCase(searchKeyword))
                        .or(item.type.stringValue().containsIgnoreCase(searchKeyword));
            } else if ("name".equalsIgnoreCase(searchCondition)) {
                booleanBuilder.and(item.name.containsIgnoreCase(searchKeyword));
            } else if ("type".equalsIgnoreCase(searchCondition)) {
                booleanBuilder.and(item.type.stringValue().containsIgnoreCase(searchKeyword));
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
                return item.createdAt.desc();
            case "oldest":
                return item.createdAt.asc();
            case "highPrice":
                return item.price.desc();
            case "lowPrice":
                return item.price.asc();
            default:
                return item.createdAt.desc();
        }
    }
}
