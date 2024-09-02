package com.example.aocv_back.entity.item;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QItem is a Querydsl query type for Item
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QItem extends EntityPathBase<Item> {

    private static final long serialVersionUID = 738534653L;

    public static final QItem item = new QItem("item");

    public final EnumPath<ItemCategory> category = createEnum("category", ItemCategory.class);

    public final StringPath content = createString("content");

    public final ListPath<String, StringPath> contentImages = this.<String, StringPath>createList("contentImages", String.class, StringPath.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final StringPath name = createString("name");

    public final ListPath<Option, QOption> options = this.<Option, QOption>createList("options", Option.class, QOption.class, PathInits.DIRECT2);

    public final NumberPath<Double> price = createNumber("price", Double.class);

    public final ListPath<String, StringPath> productImages = this.<String, StringPath>createList("productImages", String.class, StringPath.class, PathInits.DIRECT2);

    public final NumberPath<Integer> quantity = createNumber("quantity", Integer.class);

    public final ListPath<com.example.aocv_back.entity.review.Review, com.example.aocv_back.entity.review.QReview> reviews = this.<com.example.aocv_back.entity.review.Review, com.example.aocv_back.entity.review.QReview>createList("reviews", com.example.aocv_back.entity.review.Review.class, com.example.aocv_back.entity.review.QReview.class, PathInits.DIRECT2);

    public final NumberPath<Double> sale = createNumber("sale", Double.class);

    public final EnumPath<ItemStatus> status = createEnum("status", ItemStatus.class);

    public final StringPath title = createString("title");

    public final EnumPath<ItemType> type = createEnum("type", ItemType.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QItem(String variable) {
        super(Item.class, forVariable(variable));
    }

    public QItem(Path<? extends Item> path) {
        super(path.getType(), path.getMetadata());
    }

    public QItem(PathMetadata metadata) {
        super(Item.class, metadata);
    }

}

