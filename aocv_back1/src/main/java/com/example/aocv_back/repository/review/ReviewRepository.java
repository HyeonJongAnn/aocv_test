package com.example.aocv_back.repository.review;


import com.example.aocv_back.entity.review.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    void deleteByItemId(int itemId);
    Optional<Review> findByIdAndItemId(Integer reviewId, Integer itemId);

    @Query("SELECT r " +
            "FROM Review r " +
            "WHERE r.item.id " +
            "= :itemId ORDER BY r.isBest DESC," +
            " r.createdAt DESC")
    Page<Review> findByItemIdOrderByIsBestDescCreatedAtDesc(@Param("itemId") Integer itemId, Pageable pageable);
}
