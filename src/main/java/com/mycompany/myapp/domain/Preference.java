package com.mycompany.myapp.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

import com.mycompany.myapp.domain.enumeration.Units;

/**
 * A Preference.
 */
@Entity
@Table(name = "preference")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "preference")
public class Preference implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    private Long id;

    @NotNull
    @Min(value = 10)
    @Max(value = 21)
    @Column(name = "weekly_goal", nullable = false)
    private Integer weeklyGoal;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "weight_units", nullable = false)
    private Units weightUnits;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getWeeklyGoal() {
        return weeklyGoal;
    }

    public Preference weeklyGoal(Integer weeklyGoal) {
        this.weeklyGoal = weeklyGoal;
        return this;
    }

    public void setWeeklyGoal(Integer weeklyGoal) {
        this.weeklyGoal = weeklyGoal;
    }

    public Units getWeightUnits() {
        return weightUnits;
    }

    public Preference weightUnits(Units weightUnits) {
        this.weightUnits = weightUnits;
        return this;
    }

    public void setWeightUnits(Units weightUnits) {
        this.weightUnits = weightUnits;
    }

    public User getUser() {
        return user;
    }

    public Preference user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Preference preference = (Preference) o;
        if (preference.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), preference.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Preference{" +
            "id=" + getId() +
            ", weeklyGoal=" + getWeeklyGoal() +
            ", weightUnits='" + getWeightUnits() + "'" +
            "}";
    }
}
