const config = require("../Config");

let queryGenerator = {};

queryGenerator.getDataresourcesQuery = () => {
  let dsl = {};
  dsl.match_all = {};

  let body = {
    size: 1000,
    from: 0
  };
  body.query = dsl;
  body.sort = [{
    "data_resource_id": "asc"
  }];
  
  return body;
};

queryGenerator.getSearchQueryV2 = (searchText, options) => {
  let body = {
    size: options.pageInfo.pageSize,
    from: (options.pageInfo.page - 1 ) * options.pageInfo.pageSize
  };

  const strArr = searchText.trim().split(" ");
  const result = [];
  strArr.forEach((term) => {
    const t = term.trim();
    if (t.length > 2) {
      result.push(t);
    }
  });
  const keywords = result.length === 0 ? "" : result.join(" ");
  if(keywords != ""){
    const termArr = keywords.split(" ");
    let compoundQuery = {};
    compoundQuery.bool = {};
    compoundQuery.bool.must = [];
    termArr.forEach((term) => {
      let searchTerm = term.trim();
      if(searchTerm != ""){
        let clause = {};
        clause.bool = {};
        clause.bool.should = [];
        let dsl = {};
        dsl.multi_match = {};
        dsl.multi_match.query = searchTerm;
        //dsl.multi_match.analyzer = "standard_analyzer";
        dsl.multi_match.fields = [
          "data_resource_name",
          "dataset_name",
          "desc",
          "primary_dataset_scope",
          "poc",
          "poc_email",
          "published_in",
          "program_name",
          "project_name"
        ];
        clause.bool.should.push(dsl);
        let nestedFields = [
        "case_age.k",
          "case_age_at_diagnosis.k",
          "case_age_at_trial.k",
          "case_disease_diagnosis.k",
          "case_disease_diagnosis.s",
          "case_ethnicity.k",
          "case_gender.k",
          "case_proband.k",
          "case_race.k",
          "case_sex.k",
          "case_sex_at_birth.k",
          "case_treatment_administered.k",
          "case_treatment_outcome.k",
          "case_tumor_site.k",
          "donor_age.k",
          "donor_disease_diagnosis.k",
          "donor_sex.k",
          "project_anatomic_site.k",
          "project_cancer_studied.k",
          "sample_analyte_type.k",
          "sample_anatomic_site.k",
          "sample_assay_method.k",
          "sample_composition_type.k",
          "sample_repository_name.k",
          "sample_is_normal.k",
          "sample_is_xenograft.k"
        ];
        nestedFields.map((f) => {
          let idx = f.indexOf('.');
          let parent = f.substring(0, idx);
          dsl = {};
          dsl.nested = {};
          dsl.nested.path = parent;
          dsl.nested.query = {};
          dsl.nested.query.match = {};
          dsl.nested.query.match[f] = {"query":searchTerm};
          clause.bool.should.push(dsl);
        });
        dsl = {};
        dsl.nested = {};
        dsl.nested.path = "projects";
        dsl.nested.query = {};
        dsl.nested.query.bool = {};
        dsl.nested.query.bool.should = [];
        let m = {};
        m.match = {
          "projects.p_k": searchTerm
        };
        dsl.nested.query.bool.should.push(m);
        m = {};
        m.nested = {};
        m.nested.path = "projects.p_v";
        m.nested.query = {};
        m.nested.query.match = {};
        m.nested.query.match["projects.p_v.k"] = {"query":searchTerm};
        dsl.nested.query.bool.should.push(m);
        clause.bool.should.push(dsl);
    
        dsl = {};
        dsl.nested = {};
        dsl.nested.path = "additional";
        dsl.nested.query = {};
        dsl.nested.query.bool = {};
        dsl.nested.query.bool.should = [];
        m = {};
        m.match = {
          "additional.attr_name": searchTerm
        };
        dsl.nested.query.bool.should.push(m);
        m = {};
        m.nested = {};
        m.nested.path = "additional.attr_set";
        m.nested.query = {};
        m.nested.query.match = {};
        m.nested.query.match["additional.attr_set.k"] = {"query":searchTerm};
        dsl.nested.query.bool.should.push(m);
        clause.bool.should.push(dsl);
        compoundQuery.bool.must.push(clause);
      }
    });
    body.query = compoundQuery;
  }
  
  let agg = {};
  agg.myAgg = {};
  agg.myAgg.terms = {};
  agg.myAgg.terms.field = "data_resource_id";
  agg.myAgg.terms.size = 1000;

  body.aggs = agg;
  body.sort = [];
  let tmp = {};
  tmp[options.sort.k] = options.sort.v;
  body.sort.push(tmp);
  body.highlight = {
    pre_tags: ["<b>"],
    post_tags: ["</b>"],
    fields: {
      "data_resource_name": { number_of_fragments: 0 },
      "dataset_name": { number_of_fragments: 0 },
      "desc": { number_of_fragments: 0 },
      "primary_dataset_scope": { number_of_fragments: 0 },
      "poc": { number_of_fragments: 0 },
      "poc_email": { number_of_fragments: 0 },
      "published_in": { number_of_fragments: 0 },
      "program_name": { number_of_fragments: 0 },
      "project_name": { number_of_fragments: 0 },
      "case_age.k": { number_of_fragments: 0 },
      "case_age_at_diagnosis.k": { number_of_fragments: 0 },
      "case_age_at_trial.k": { number_of_fragments: 0 },
      "case_disease_diagnosis.k": { number_of_fragments: 0 },
      "case_disease_diagnosis.s": { number_of_fragments: 0 },
      "case_ethnicity.k": { number_of_fragments: 0 },
      "case_gender.k": { number_of_fragments: 0 },
      "case_proband.k": { number_of_fragments: 0 },
      "case_race.k": { number_of_fragments: 0 },
      "case_sex.k": { number_of_fragments: 0 },
      "case_sex_at_birth.k": { number_of_fragments: 0 },
      "case_treatment_administered.k": { number_of_fragments: 0 },
      "case_treatment_outcome.k": { number_of_fragments: 0 },
      "case_tumor_site.k": { number_of_fragments: 0 },
      "donor_age.k": { number_of_fragments: 0 },
      "donor_disease_diagnosis.k": { number_of_fragments: 0 },
      "donor_sex.k": { number_of_fragments: 0 },
      "project_anatomic_site.k": { number_of_fragments: 0 },
      "project_cancer_studied.k": { number_of_fragments: 0 },
      "sample_analyte_type.k": { number_of_fragments: 0 },
      "sample_anatomic_site.k": { number_of_fragments: 0 },
      "sample_assay_method.k": { number_of_fragments: 0 },
      "sample_composition_type.k": { number_of_fragments: 0 },
      "sample_repository_name.k": { number_of_fragments: 0 },
      "sample_is_normal.k": { number_of_fragments: 0 },
      "sample_is_xenograft.k": { number_of_fragments: 0 }
    },
  };
  return body;
};

queryGenerator.getSearchQueryV1 = (searchText, filters, options) => {
  const resourceTypes = ["research_data_repository", "program", "catalog", "registry"];
  let query = {};
  query.bool = {};
  query.bool.should = [];
  if(searchText != ""){
    let clause = {};
    clause.bool = {};
    clause.bool.should = [];
    let dsl = {};
    dsl.multi_match = {};
    dsl.multi_match.query = searchText;
    //dsl.multi_match.analyzer = "standard_analyzer";
    dsl.multi_match.fields = [
      "data_resource_id",
      "dataset_name",
      "desc",
      "primary_dataset_scope",
      "poc",
      "poc_email",
      "published_in",
      "program_name",
      "project_name"
    ];
    clause.bool.should.push(dsl);
    let nestedFields = [
    "case_age.k",
      "case_age_at_diagnosis.k",
      "case_age_at_trial.k",
      "case_disease_diagnosis.k",
      "case_disease_diagnosis.s",
      "case_ethnicity.k",
      "case_gender.k",
      "case_proband.k",
      "case_race.k",
      "case_sex.k",
      "case_sex_at_birth.k",
      "case_treatment_administered.k",
      "case_treatment_outcome.k",
      "case_tumor_site.k",
      "donor_age.k",
      "donor_disease_diagnosis.k",
      "donor_sex.k",
      "project_anatomic_site.k",
      "project_cancer_studied.k",
      "sample_analyte_type.k",
      "sample_anatomic_site.k",
      "sample_assay_method.k",
      "sample_composition_type.k",
      "sample_repository_name.k",
      "sample_is_normal.k",
      "sample_is_xenograft.k"
    ];
    nestedFields.map((f) => {
      let idx = f.indexOf('.');
      let parent = f.substring(0, idx);
      dsl = {};
      dsl.nested = {};
      dsl.nested.path = parent;
      dsl.nested.query = {};
      dsl.nested.query.match = {};
      dsl.nested.query.match[f] = {"query":searchText};
      clause.bool.should.push(dsl);
    });
    dsl = {};
    dsl.nested = {};
    dsl.nested.path = "projects";
    dsl.nested.query = {};
    dsl.nested.query.bool = {};
    dsl.nested.query.bool.should = [];
    let m = {};
    m.match = {
      "projects.p_k": searchText
    };
    dsl.nested.query.bool.should.push(m);
    m = {};
    m.nested = {};
    m.nested.path = "projects.p_v";
    m.nested.query = {};
    m.nested.query.match = {};
    m.nested.query.match["projects.p_v.k"] = {"query":searchText};
    dsl.nested.query.bool.should.push(m);
    clause.bool.should.push(dsl);

    dsl = {};
    dsl.nested = {};
    dsl.nested.path = "additional";
    dsl.nested.query = {};
    dsl.nested.query.bool = {};
    dsl.nested.query.bool.should = [];
    m = {};
    m.match = {
      "additional.attr_name": searchText
    };
    dsl.nested.query.bool.should.push(m);
    m = {};
    m.nested = {};
    m.nested.path = "additional.attr_set";
    m.nested.query = {};
    m.nested.query.match = {};
    m.nested.query.match["additional.attr_set.k"] = {"query":searchText};
    dsl.nested.query.bool.should.push(m);
    clause.bool.should.push(dsl);
    query.bool.should.push(clause);
  }
  const filterKeys = Object.keys(filters);
  if(filterKeys.length > 0){
    clause = {};
    clause.bool = {};
    clause.bool.should = [];
    for(let k = 0; k < filterKeys.length; k ++){
      let attribute = "";
      if (resourceTypes.indexOf(filterKeys[k]) > -1) {
        attribute = "data_resource_id";
      }
      else if(filterKeys[k] === "number_of_cases") {
        attribute = "case_id";
      }
      else if(filterKeys[k] === "number_of_samples") {
        attribute = "sample_id";
      }
      else if (config.filterableFields.indexOf(filterKeys[k]) > -1 ) {
        attribute = filterKeys[k];
      }
      else {
        attribute = "";
      }
      
      if(attribute !== ""){
        if(attribute == "data_resource_id"){
          filters[filterKeys[k]].map((item) => {
            let tmp = {};
            tmp.match = {};
            tmp.match[attribute] = {"query":item};
            clause.bool.should.push(tmp);
          });
        }
        else if (attribute == "case_id") {
          filters["number_of_cases"].map((item) => {
            let tmp = {};
            tmp.range = {};
            tmp.range[attribute] = {};
            if (item === "0 - 10 Cases") {
              tmp.range[attribute].gte = 0;
              tmp.range[attribute].lt = 10;
            }
            else if (item === "10 - 100 Cases") {
              tmp.range[attribute].gte = 10;
              tmp.range[attribute].lt = 100;
            }
            else if (item === "100 - 1000 Cases") {
              tmp.range[attribute].gte = 100;
              tmp.range[attribute].lt = 1000;
            }
            else {
              tmp.range[attribute].gte = 1000;
            }
            clause.bool.should.push(tmp);
          });
        }
        else if (attribute == "sample_id") {
          filters["number_of_samples"].map((item) => {
            let tmp = {};
            tmp.range = {};
            tmp.range[attribute] = {};
            if (item === "0 - 10 Samples") {
              tmp.range[attribute].gte = 0;
              tmp.range[attribute].lt = 10;
            }
            else if (item === "10 - 100 Samples") {
              tmp.range[attribute].gte = 10;
              tmp.range[attribute].lt = 100;
            }
            else if (item === "100 - 1000 Samples") {
              tmp.range[attribute].gte = 100;
              tmp.range[attribute].lt = 1000;
            }
            else {
              tmp.range[attribute].gte = 1000;
            }
            clause.bool.should.push(tmp);
          });
        }
        else{
          filters[filterKeys[k]].map((item) => {
          
            let tmp = {};
            tmp.nested = {};
            tmp.nested.path = attribute;
            tmp.nested.query = {};
            tmp.nested.query.match = {};
            tmp.nested.query.match[`${attribute}.n`] = {"query":item};
            clause.bool.should.push(tmp);
          });
        }
        
      }
    }
    if(clause.bool.should.length > 0){
      query.bool.should.push(clause);
    }
    
  }

  let body = {
    size: options.pageInfo.pageSize,
    from: (options.pageInfo.page - 1 ) * options.pageInfo.pageSize
  };
  body.query = query;
  body.sort = [];
  let tmp = {};
  tmp[options.sort.k] = options.sort.v;
  body.sort.push(tmp);
  body.highlight = {
    pre_tags: ["<b>"],
    post_tags: ["</b>"],
    fields: {
      "data_resource_id": { number_of_fragments: 0 },
      "dataset_name": { number_of_fragments: 0 },
      "desc": { number_of_fragments: 0 },
      "primary_dataset_scope": { number_of_fragments: 0 },
      "poc": { number_of_fragments: 0 },
      "poc_email": { number_of_fragments: 0 },
      "published_in": { number_of_fragments: 0 },
      "program_name": { number_of_fragments: 0 },
      "project_name": { number_of_fragments: 0 },
      "case_age.k": { number_of_fragments: 0 },
      "case_age_at_diagnosis.k": { number_of_fragments: 0 },
      "case_age_at_trial.k": { number_of_fragments: 0 },
      "case_disease_diagnosis.k": { number_of_fragments: 0 },
      "case_disease_diagnosis.s": { number_of_fragments: 0 },
      "case_ethnicity.k": { number_of_fragments: 0 },
      "case_gender.k": { number_of_fragments: 0 },
      "case_proband.k": { number_of_fragments: 0 },
      "case_race.k": { number_of_fragments: 0 },
      "case_sex.k": { number_of_fragments: 0 },
      "case_sex_at_birth.k": { number_of_fragments: 0 },
      "case_treatment_administered.k": { number_of_fragments: 0 },
      "case_treatment_outcome.k": { number_of_fragments: 0 },
      "case_tumor_site.k": { number_of_fragments: 0 },
      "donor_age.k": { number_of_fragments: 0 },
      "donor_disease_diagnosis.k": { number_of_fragments: 0 },
      "donor_sex.k": { number_of_fragments: 0 },
      "project_anatomic_site.k": { number_of_fragments: 0 },
      "project_cancer_studied.k": { number_of_fragments: 0 },
      "sample_analyte_type.k": { number_of_fragments: 0 },
      "sample_anatomic_site.k": { number_of_fragments: 0 },
      "sample_assay_method.k": { number_of_fragments: 0 },
      "sample_composition_type.k": { number_of_fragments: 0 },
      "sample_repository_name.k": { number_of_fragments: 0 },
      "sample_is_normal.k": { number_of_fragments: 0 },
      "sample_is_xenograft.k": { number_of_fragments: 0 }
    },
  };
  return body;
};

queryGenerator.getParticipatingResourcesSearchQuery = (filters, options) => {
  let query = {};
  const filterKeys = Object.keys(filters);
  if(filterKeys.length > 0){
    query.bool = {};
    query.bool.must = [];
    for(let k = 0; k < filterKeys.length; k ++){
      let attribute = "";
      if (filterKeys[k] === "data_resource_type") {
        attribute = "resource_type";
      }
      else if(filterKeys[k] === "resource_data_content_type") {
        attribute = "data_content_type";
      }
      else {
        attribute = "";
      }
      
      if(attribute !== ""){
        let clause = {};
        clause.bool = {};
        clause.bool.should = [];
        filters[filterKeys[k]].map((item) => {
          let tmp = {};
          tmp.match = {};
          tmp.match[attribute] = item;
          clause.bool.should.push(tmp);
        });
        query.bool.must.push(clause);
      }
    }
    if(query.bool.must.length === 0){
      query = {};
      query.match_all = {};
    }
  }
  else{
    query.match_all = {};
  }

  let body = {
    size: options.pageInfo.pageSize,
    from: (options.pageInfo.page - 1 ) * options.pageInfo.pageSize
  };
  body.query = query;
  body.sort = [];
  let tmp = {};
  tmp["data_resource_id"] = "asc";
  body.sort.push(tmp);
  return body;
};

queryGenerator.getDocumentSearchQuery = (keyword, options) => {
  let body = {
    size: options.pageInfo.pageSize,
    from: (options.pageInfo.page - 1 ) * options.pageInfo.pageSize
  };
  let query = {};
  const strArr = keyword.trim().split(" ");
  const result = [];
  strArr.forEach((term) => {
    const t = term.trim();
    if (t.length > 2) {
      result.push(t);
    }
  });
  const keywords = result.length === 0 ? "" : result.join(" ");
  if(keywords != ""){
    const termArr = keywords.split(" ");
    let compoundQuery = {};
    compoundQuery.bool = {};
    compoundQuery.bool.must = [];
    termArr.forEach((term) => {
      let searchTerm = term.trim();
      if(searchTerm != ""){
        let dsl = {};
        dsl.multi_match = {};
        dsl.multi_match.query = searchTerm;
        //dsl.multi_match.analyzer = "standard_analyzer";
        dsl.multi_match.fields = [
          "title", "description", "content"
        ];
        compoundQuery.bool.must.push(dsl);
      }
    });
    body.query = compoundQuery;
  }
  else {
    query.match_all = {};
    body.query = query;
  }

  body.highlight = {
    pre_tags: ["<b>"],
    post_tags: ["</b>"],
    fields: {
      "title": { number_of_fragments: 0 },
      "description": { number_of_fragments: 0 },
      "content": { number_of_fragments: 0 },
      "link": { number_of_fragments: 0 }
    },
  };
  return body;
};

queryGenerator.getDatasetByIdQuery = (id) => {
  let dsl = {};
  dsl.match = {};
  dsl.match.dataset_id = id;

  let body = {
    size: 1,
    from: 0
  };
  body.query = dsl;
  body.sort = [{
    "dataset_id": "asc"
  }];
  
  return body;
};

queryGenerator.getDataresourceByIdQuery = (id) => {
  let dsl = {};
  dsl.match = {};
  dsl.match.data_resource_id = id;

  let body = {
    size: 1,
    from: 0
  };
  body.query = dsl;
  body.sort = [{
    "data_resource_id": "asc"
  }];
  
  return body;
};

queryGenerator.getDatasetsByDataresourceIdQuery = (dataresourceId) => {
  let dsl = {};
  dsl.match = {};
  dsl.match.data_resource_id = dataresourceId;

  let body = {
    size: 1000,
    from: 0
  };
  body.query = dsl;
  body.sort = [{
    "dataset_id": "asc"
  }];
  
  return body;
};

module.exports = queryGenerator;