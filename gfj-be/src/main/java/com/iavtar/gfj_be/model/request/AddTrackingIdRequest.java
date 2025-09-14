package com.iavtar.gfj_be.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddTrackingIdRequest {

    private String shippingId;

    private String trackingId;

    private String invoiceNumber;

    private String trackingNote;

}
