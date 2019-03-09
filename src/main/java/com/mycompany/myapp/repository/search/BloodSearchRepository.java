package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Blood;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Blood entity.
 */
public interface BloodSearchRepository extends ElasticsearchRepository<Blood, Long> {
}
