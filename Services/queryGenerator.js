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

queryGenerator.getSearchQuery = (searchText, filters, options) => {
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
      switch (filterKeys[k]) {
        case "Cancer Type":
          attribute = "project_cancer_studied";
          break;
        case "Case Disease Diagnosis":
          attribute = "case_disease_diagnosis";
          break;
        case "Anatomic Site Studied":
          attribute = "project_anatomic_site_studied";
          break;
        case "Sample Anotomic Site":
          attribute = "sample_anatomic_site";
          break;
        case "Sample Assay Method":
          attribute = "sample_assay_method";
          break;
        case "Sample Analyte Type":
          attribute = "sample_analyte_type";
          break;
        case "Case Age":
          attribute = "case_age";
          break;
        case "Case Ethnicity":
          attribute = "case_ethnicity";
          break;
        case "Case Race":
          attribute = "case_race";
          break;
        case "Case Sex":
          attribute = "case_sex";
          break;
        default:
          attribute = "";
      }
      if(attribute !== ""){
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

module.exports = queryGenerator;