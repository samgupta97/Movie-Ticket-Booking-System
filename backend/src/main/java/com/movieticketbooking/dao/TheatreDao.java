//package com.movieticketbooking.dao;
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import com.movieticketbooking.entity.Location;
//import com.movieticketbooking.entity.Theatre;
//
//@Repository
//public interface TheatreDao extends JpaRepository<Theatre, Integer> {
//
//	List<Theatre> findByStatus(String status);
//	
//	List<Theatre> findByLocationAndStatus(Location location, String status);
//
//}


//package com.movieticketbooking.dao;
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import com.movieticketbooking.entity.Location;
//import com.movieticketbooking.entity.Theatre;
//
//@Repository
//public interface TheatreDao extends JpaRepository<Theatre, Integer> {
//
//    // Exact match (keep it for existing logic)
//    List<Theatre> findByStatus(String status);
//
//    // Exact match by location
//    List<Theatre> findByLocationAndStatus(Location location, String status);
//
//    // NEW — LIKE QUERY (Case insensitive)
//    @Query("SELECT t FROM Theatre t WHERE LOWER(t.status) LIKE LOWER(CONCAT(:status, '%'))")
//    List<Theatre> findByStatusLike(@Param("status") String status);
//
//}


package com.movieticketbooking.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movieticketbooking.entity.Location;
import com.movieticketbooking.entity.Theatre;

@Repository
public interface TheatreDao extends JpaRepository<Theatre, Integer> {

    // Fetch theatres by exact status
    List<Theatre> findByStatus(String status);

    // Fetch theatres by location + status
    List<Theatre> findByLocationAndStatus(Location location, String status);

}

