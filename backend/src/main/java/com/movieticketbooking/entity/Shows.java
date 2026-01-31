//package com.movieticketbooking.entity;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.List;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.OneToMany;
//import lombok.Data;
//
//@Data
//@Entity
//public class Shows {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int id;
//
//    private LocalDate showDate;
//    private LocalTime startTime;
//    private LocalTime endTime;
//
//    private String language;
//    private String showType;
//    private String status;
//
//    @ManyToOne
//    @JoinColumn(name = "movie_id")
//    private Movie movie;
//
//    @ManyToOne
//    @JoinColumn(name = "screen_id")
//    private Screen screen;
//
//    private BigDecimal goldSeatPrice;
//    private BigDecimal regularSeatPrice;
//    private BigDecimal premiumSeatPrice;
//
//    @JsonIgnore
//    @ManyToOne
//    @JoinColumn(name = "theatre_id")
//    private Theatre theatre;
//
//    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL)
//    private List<ShowSeat> showSeats;
//
//
//}
//
//
//package com.movieticketbooking.entity;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.List;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.OneToMany;
//import lombok.Data;
//
//@Data
//@Entity
//public class Shows {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int id;
//
//    private LocalDate showDate;
//    private LocalTime startTime;
//    private LocalTime endTime;
//
//    private String language;
//    private String showType;
//    private String status;
//
//    @ManyToOne
//    @JoinColumn(name = "movie_id")
//    private Movie movie;
//
//    @ManyToOne
//    @JoinColumn(name = "screen_id")
//    private Screen screen;
//
//    private BigDecimal goldSeatPrice;
//    private BigDecimal regularSeatPrice;
//    private BigDecimal premiumSeatPrice;
//
//    @JsonIgnore
//    @ManyToOne
//    @JoinColumn(name = "theatre_id")
//    private Theatre theatre;
//
//    // ✅ FINAL FIX — Add CascadeType.ALL so child seats load correctly
//    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL)
//    private List<ShowSeat> showSeats;
//}

package com.movieticketbooking.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Shows {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String language;
    private String showType;
    private String status;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "screen_id")
    private Screen screen;

    private BigDecimal goldSeatPrice;
    private BigDecimal regularSeatPrice;
    private BigDecimal premiumSeatPrice;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "theatre_id")
    private Theatre theatre;

    // DO NOT ADD @JsonIgnore HERE
    // This will now load showSeats to frontend
    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL)
    private List<ShowSeat> showSeats;
}
