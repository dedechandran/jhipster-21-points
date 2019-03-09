package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Points;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Points entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsRepository extends JpaRepository<Points, Long> {

    @Query("select points from Points points where points.user.login = ?#{principal.username}")
    Page<Points> findByUserIsCurrentUser(Pageable pageable);

    List<Points> findAllByDateBetweenAndUserLogin(LocalDate startOfWeek, LocalDate endOfWeek, Optional<String> currentUserLogin);
}
