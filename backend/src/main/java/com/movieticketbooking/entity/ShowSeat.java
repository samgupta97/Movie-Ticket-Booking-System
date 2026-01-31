package com.movieticketbooking.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String seatNumber;
    private String seatType;
    private String seatPosition;
    private BigDecimal price;

    private String status = "AVAILABLE";   // 👈 NEW FIELD

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "show_id")
    private Shows show;
}

