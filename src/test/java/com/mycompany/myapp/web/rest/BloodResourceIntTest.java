package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.TwentyOnePointsApp;

import com.mycompany.myapp.domain.Blood;
import com.mycompany.myapp.repository.BloodRepository;
import com.mycompany.myapp.repository.search.BloodSearchRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BloodResource REST controller.
 *
 * @see BloodResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TwentyOnePointsApp.class)
public class BloodResourceIntTest {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_SYSTOLIC = 1;
    private static final Integer UPDATED_SYSTOLIC = 2;

    private static final Integer DEFAULT_DIASTOLIC = 1;
    private static final Integer UPDATED_DIASTOLIC = 2;

    @Autowired
    private BloodRepository bloodRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.BloodSearchRepositoryMockConfiguration
     */
    @Autowired
    private BloodSearchRepository mockBloodSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restBloodMockMvc;

    private Blood blood;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BloodResource bloodResource = new BloodResource(bloodRepository, mockBloodSearchRepository);
        this.restBloodMockMvc = MockMvcBuilders.standaloneSetup(bloodResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Blood createEntity(EntityManager em) {
        Blood blood = new Blood()
            .date(DEFAULT_DATE)
            .systolic(DEFAULT_SYSTOLIC)
            .diastolic(DEFAULT_DIASTOLIC);
        return blood;
    }

    @Before
    public void initTest() {
        blood = createEntity(em);
    }

    @Test
    @Transactional
    public void createBlood() throws Exception {
        int databaseSizeBeforeCreate = bloodRepository.findAll().size();

        // Create the Blood
        restBloodMockMvc.perform(post("/api/blood")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blood)))
            .andExpect(status().isCreated());

        // Validate the Blood in the database
        List<Blood> bloodList = bloodRepository.findAll();
        assertThat(bloodList).hasSize(databaseSizeBeforeCreate + 1);
        Blood testBlood = bloodList.get(bloodList.size() - 1);
        assertThat(testBlood.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testBlood.getSystolic()).isEqualTo(DEFAULT_SYSTOLIC);
        assertThat(testBlood.getDiastolic()).isEqualTo(DEFAULT_DIASTOLIC);

        // Validate the Blood in Elasticsearch
        verify(mockBloodSearchRepository, times(1)).save(testBlood);
    }

    @Test
    @Transactional
    public void createBloodWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bloodRepository.findAll().size();

        // Create the Blood with an existing ID
        blood.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBloodMockMvc.perform(post("/api/blood")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blood)))
            .andExpect(status().isBadRequest());

        // Validate the Blood in the database
        List<Blood> bloodList = bloodRepository.findAll();
        assertThat(bloodList).hasSize(databaseSizeBeforeCreate);

        // Validate the Blood in Elasticsearch
        verify(mockBloodSearchRepository, times(0)).save(blood);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodRepository.findAll().size();
        // set the field null
        blood.setDate(null);

        // Create the Blood, which fails.

        restBloodMockMvc.perform(post("/api/blood")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blood)))
            .andExpect(status().isBadRequest());

        List<Blood> bloodList = bloodRepository.findAll();
        assertThat(bloodList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBlood() throws Exception {
        // Initialize the database
        bloodRepository.saveAndFlush(blood);

        // Get all the bloodList
        restBloodMockMvc.perform(get("/api/blood?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blood.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }
    
    @Test
    @Transactional
    public void getBlood() throws Exception {
        // Initialize the database
        bloodRepository.saveAndFlush(blood);

        // Get the blood
        restBloodMockMvc.perform(get("/api/blood/{id}", blood.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(blood.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.systolic").value(DEFAULT_SYSTOLIC))
            .andExpect(jsonPath("$.diastolic").value(DEFAULT_DIASTOLIC));
    }

    @Test
    @Transactional
    public void getNonExistingBlood() throws Exception {
        // Get the blood
        restBloodMockMvc.perform(get("/api/blood/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBlood() throws Exception {
        // Initialize the database
        bloodRepository.saveAndFlush(blood);

        int databaseSizeBeforeUpdate = bloodRepository.findAll().size();

        // Update the blood
        Blood updatedBlood = bloodRepository.findById(blood.getId()).get();
        // Disconnect from session so that the updates on updatedBlood are not directly saved in db
        em.detach(updatedBlood);
        updatedBlood
            .date(UPDATED_DATE)
            .systolic(UPDATED_SYSTOLIC)
            .diastolic(UPDATED_DIASTOLIC);

        restBloodMockMvc.perform(put("/api/blood")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBlood)))
            .andExpect(status().isOk());

        // Validate the Blood in the database
        List<Blood> bloodList = bloodRepository.findAll();
        assertThat(bloodList).hasSize(databaseSizeBeforeUpdate);
        Blood testBlood = bloodList.get(bloodList.size() - 1);
        assertThat(testBlood.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testBlood.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBlood.getDiastolic()).isEqualTo(UPDATED_DIASTOLIC);

        // Validate the Blood in Elasticsearch
        verify(mockBloodSearchRepository, times(1)).save(testBlood);
    }

    @Test
    @Transactional
    public void updateNonExistingBlood() throws Exception {
        int databaseSizeBeforeUpdate = bloodRepository.findAll().size();

        // Create the Blood

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloodMockMvc.perform(put("/api/blood")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(blood)))
            .andExpect(status().isBadRequest());

        // Validate the Blood in the database
        List<Blood> bloodList = bloodRepository.findAll();
        assertThat(bloodList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Blood in Elasticsearch
        verify(mockBloodSearchRepository, times(0)).save(blood);
    }

    @Test
    @Transactional
    public void deleteBlood() throws Exception {
        // Initialize the database
        bloodRepository.saveAndFlush(blood);

        int databaseSizeBeforeDelete = bloodRepository.findAll().size();

        // Delete the blood
        restBloodMockMvc.perform(delete("/api/blood/{id}", blood.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Blood> bloodList = bloodRepository.findAll();
        assertThat(bloodList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Blood in Elasticsearch
        verify(mockBloodSearchRepository, times(1)).deleteById(blood.getId());
    }

    @Test
    @Transactional
    public void searchBlood() throws Exception {
        // Initialize the database
        bloodRepository.saveAndFlush(blood);
        when(mockBloodSearchRepository.search(queryStringQuery("id:" + blood.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(blood), PageRequest.of(0, 1), 1));
        // Search the blood
        restBloodMockMvc.perform(get("/api/_search/blood?query=id:" + blood.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blood.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Blood.class);
        Blood blood1 = new Blood();
        blood1.setId(1L);
        Blood blood2 = new Blood();
        blood2.setId(blood1.getId());
        assertThat(blood1).isEqualTo(blood2);
        blood2.setId(2L);
        assertThat(blood1).isNotEqualTo(blood2);
        blood1.setId(null);
        assertThat(blood1).isNotEqualTo(blood2);
    }
}
