package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Blood;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Blood entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BloodRepository extends JpaRepository<Blood, Long> {

    @Query("select blood from Blood blood where blood.user.login = ?#{principal.username}")
    List<Blood> findByUserIsCurrentUser();

}
