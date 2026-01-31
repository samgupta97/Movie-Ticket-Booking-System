package com.movieticketbooking.dto;

import java.util.List;
import lombok.Data;

@Data
public class AddBookingRequest {

    private List<Integer> seatIds;   // <-- this will be seat.id = show_seat.id

    private int showId;              // needed to link booking to show

    private int customerId;          // customer

}
