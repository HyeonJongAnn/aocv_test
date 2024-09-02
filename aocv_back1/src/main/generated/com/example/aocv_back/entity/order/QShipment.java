package com.example.aocv_back.entity.order;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QShipment is a Querydsl query type for Shipment
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QShipment extends EntityPathBase<Shipment> {

    private static final long serialVersionUID = -417260053L;

    public static final QShipment shipment = new QShipment("shipment");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath status = createString("status");

    public final StringPath trackingNumber = createString("trackingNumber");

    public QShipment(String variable) {
        super(Shipment.class, forVariable(variable));
    }

    public QShipment(Path<? extends Shipment> path) {
        super(path.getType(), path.getMetadata());
    }

    public QShipment(PathMetadata metadata) {
        super(Shipment.class, metadata);
    }

}

