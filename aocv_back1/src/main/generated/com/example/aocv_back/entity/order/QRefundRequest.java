package com.example.aocv_back.entity.order;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRefundRequest is a Querydsl query type for RefundRequest
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRefundRequest extends EntityPathBase<RefundRequest> {

    private static final long serialVersionUID = -1002425786L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRefundRequest refundRequest = new QRefundRequest("refundRequest");

    public final StringPath adminNotes = createString("adminNotes");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final QOrder order;

    public final NumberPath<Integer> refundAmount = createNumber("refundAmount", Integer.class);

    public final StringPath refundReason = createString("refundReason");

    public final DateTimePath<java.time.LocalDateTime> requestDate = createDateTime("requestDate", java.time.LocalDateTime.class);

    public final StringPath status = createString("status");

    public final com.example.aocv_back.entity.user.QUser user;

    public QRefundRequest(String variable) {
        this(RefundRequest.class, forVariable(variable), INITS);
    }

    public QRefundRequest(Path<? extends RefundRequest> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRefundRequest(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRefundRequest(PathMetadata metadata, PathInits inits) {
        this(RefundRequest.class, metadata, inits);
    }

    public QRefundRequest(Class<? extends RefundRequest> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.order = inits.isInitialized("order") ? new QOrder(forProperty("order"), inits.get("order")) : null;
        this.user = inits.isInitialized("user") ? new com.example.aocv_back.entity.user.QUser(forProperty("user")) : null;
    }

}

