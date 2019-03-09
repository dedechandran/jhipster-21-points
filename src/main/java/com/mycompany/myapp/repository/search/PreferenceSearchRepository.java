package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Preference;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Preference entity.
 */
public interface PreferenceSearchRepository extends ElasticsearchRepository<Preference, Long> {
}
