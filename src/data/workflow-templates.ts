import { WorkflowTemplate } from '../types/workflow';

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'diabetes-screening',
    name: 'Diabetes Screening',
    description: 'Standard workflow for diabetes screening and risk assessment',
    type: 'clinical',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'check-age',
          type: 'condition',
          data: { 
            label: 'Check Age',
            condition: 'patient.age >= 45'
          }
        },
        {
          id: 'check-hba1c',
          type: 'condition',
          data: { 
            label: 'Check HbA1c',
            condition: 'patient.hba1c >= 5.7'
          }
        },
        {
          id: 'check-risk-factors',
          type: 'condition',
          data: { 
            label: 'Check Risk Factors',
            condition: 'patient.hasRiskFactors'
          }
        },
        {
          id: 'recommend-screening',
          type: 'action',
          data: { 
            label: 'Recommend Screening',
            action: 'recommendScreening'
          }
        },
        {
          id: 'schedule-followup',
          type: 'action',
          data: { 
            label: 'Schedule Follow-up',
            action: 'scheduleFollowup'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check-age' },
        { id: 'e2', source: 'check-age', target: 'check-hba1c' },
        { id: 'e3', source: 'check-hba1c', target: 'check-risk-factors' },
        { id: 'e4', source: 'check-risk-factors', target: 'recommend-screening' },
        { id: 'e5', source: 'recommend-screening', target: 'schedule-followup' },
        { id: 'e6', source: 'schedule-followup', target: 'end' }
      ]
    }
  },
  {
    id: 'hypertension-management',
    name: 'Hypertension Management',
    description: 'Workflow for managing hypertension treatment and monitoring',
    type: 'clinical',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'check-bp',
          type: 'condition',
          data: { 
            label: 'Check Blood Pressure',
            condition: 'patient.systolic >= 140 || patient.diastolic >= 90'
          }
        },
        {
          id: 'check-medications',
          type: 'condition',
          data: { 
            label: 'Check Medications',
            condition: 'patient.hasAntihypertensives'
          }
        },
        {
          id: 'adjust-medication',
          type: 'action',
          data: { 
            label: 'Adjust Medication',
            action: 'adjustMedication'
          }
        },
        {
          id: 'schedule-monitoring',
          type: 'action',
          data: { 
            label: 'Schedule Monitoring',
            action: 'scheduleMonitoring'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check-bp' },
        { id: 'e2', source: 'check-bp', target: 'check-medications' },
        { id: 'e3', source: 'check-medications', target: 'adjust-medication' },
        { id: 'e4', source: 'adjust-medication', target: 'schedule-monitoring' },
        { id: 'e5', source: 'schedule-monitoring', target: 'end' }
      ]
    }
  },
  {
    id: 'data-integration',
    name: 'Data Integration',
    description: 'Workflow for integrating external data sources',
    type: 'integration',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'fetch-data',
          type: 'action',
          data: { 
            label: 'Fetch External Data',
            action: 'fetchExternalData'
          }
        },
        {
          id: 'validate-data',
          type: 'condition',
          data: { 
            label: 'Validate Data',
            condition: 'data.isValid'
          }
        },
        {
          id: 'transform-data',
          type: 'action',
          data: { 
            label: 'Transform Data',
            action: 'transformData'
          }
        },
        {
          id: 'store-data',
          type: 'action',
          data: { 
            label: 'Store Data',
            action: 'storeData'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'fetch-data' },
        { id: 'e2', source: 'fetch-data', target: 'validate-data' },
        { id: 'e3', source: 'validate-data', target: 'transform-data' },
        { id: 'e4', source: 'transform-data', target: 'store-data' },
        { id: 'e5', source: 'store-data', target: 'end' }
      ]
    }
  },
  {
    id: 'cancer-screening',
    name: 'Cancer Screening',
    description: 'Comprehensive cancer screening workflow with risk assessment and follow-up',
    type: 'clinical',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'check-age-gender',
          type: 'condition',
          data: { 
            label: 'Check Age and Gender',
            condition: '(patient.age >= 50 && patient.gender === "female") || (patient.age >= 45 && patient.gender === "male")'
          }
        },
        {
          id: 'check-family-history',
          type: 'condition',
          data: { 
            label: 'Check Family History',
            condition: 'patient.hasFamilyHistoryOfCancer'
          }
        },
        {
          id: 'check-risk-factors',
          type: 'condition',
          data: { 
            label: 'Check Risk Factors',
            condition: 'patient.hasCancerRiskFactors'
          }
        },
        {
          id: 'recommend-screening',
          type: 'action',
          data: { 
            label: 'Recommend Screening',
            action: 'recommendCancerScreening'
          }
        },
        {
          id: 'schedule-followup',
          type: 'action',
          data: { 
            label: 'Schedule Follow-up',
            action: 'scheduleCancerScreening'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check-age-gender' },
        { id: 'e2', source: 'check-age-gender', target: 'check-family-history' },
        { id: 'e3', source: 'check-family-history', target: 'check-risk-factors' },
        { id: 'e4', source: 'check-risk-factors', target: 'recommend-screening' },
        { id: 'e5', source: 'recommend-screening', target: 'schedule-followup' },
        { id: 'e6', source: 'schedule-followup', target: 'end' }
      ]
    }
  },
  {
    id: 'medication-management',
    name: 'Medication Management',
    description: 'Workflow for medication reconciliation and management',
    type: 'clinical',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'check-current-meds',
          type: 'action',
          data: { 
            label: 'Check Current Medications',
            action: 'fetchCurrentMedications'
          }
        },
        {
          id: 'check-interactions',
          type: 'condition',
          data: { 
            label: 'Check Drug Interactions',
            condition: 'medications.hasInteractions'
          }
        },
        {
          id: 'check-contraindications',
          type: 'condition',
          data: { 
            label: 'Check Contraindications',
            condition: 'medications.hasContraindications'
          }
        },
        {
          id: 'adjust-medications',
          type: 'action',
          data: { 
            label: 'Adjust Medications',
            action: 'adjustMedications'
          }
        },
        {
          id: 'schedule-review',
          type: 'action',
          data: { 
            label: 'Schedule Review',
            action: 'scheduleMedicationReview'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check-current-meds' },
        { id: 'e2', source: 'check-current-meds', target: 'check-interactions' },
        { id: 'e3', source: 'check-interactions', target: 'check-contraindications' },
        { id: 'e4', source: 'check-contraindications', target: 'adjust-medications' },
        { id: 'e5', source: 'adjust-medications', target: 'schedule-review' },
        { id: 'e6', source: 'schedule-review', target: 'end' }
      ]
    }
  },
  {
    id: 'copd-management',
    name: 'COPD Management',
    description: 'Comprehensive COPD management workflow with exacerbation prevention and monitoring',
    type: 'clinical',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'check-symptoms',
          type: 'condition',
          data: { 
            label: 'Check Symptoms',
            condition: 'patient.hasCOPDExacerbationSymptoms'
          }
        },
        {
          id: 'check-spirometry',
          type: 'condition',
          data: { 
            label: 'Check Spirometry',
            condition: 'patient.fev1 < 50'
          }
        },
        {
          id: 'check-oxygen',
          type: 'condition',
          data: { 
            label: 'Check Oxygen Levels',
            condition: 'patient.spo2 < 92'
          }
        },
        {
          id: 'adjust-treatment',
          type: 'action',
          data: { 
            label: 'Adjust Treatment',
            action: 'adjustCOPDTreatment'
          }
        },
        {
          id: 'schedule-pulmonary-rehab',
          type: 'action',
          data: { 
            label: 'Schedule Pulmonary Rehab',
            action: 'schedulePulmonaryRehab'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check-symptoms' },
        { id: 'e2', source: 'check-symptoms', target: 'check-spirometry' },
        { id: 'e3', source: 'check-spirometry', target: 'check-oxygen' },
        { id: 'e4', source: 'check-oxygen', target: 'adjust-treatment' },
        { id: 'e5', source: 'adjust-treatment', target: 'schedule-pulmonary-rehab' },
        { id: 'e6', source: 'schedule-pulmonary-rehab', target: 'end' }
      ]
    }
  },
  {
    id: 'heart-failure',
    name: 'Heart Failure Management',
    description: 'Workflow for managing heart failure patients with fluid balance monitoring',
    type: 'clinical',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'check-weight',
          type: 'condition',
          data: { 
            label: 'Check Weight Change',
            condition: 'patient.weightChange > 2'
          }
        },
        {
          id: 'check-symptoms',
          type: 'condition',
          data: { 
            label: 'Check Symptoms',
            condition: 'patient.hasHeartFailureSymptoms'
          }
        },
        {
          id: 'check-bnp',
          type: 'condition',
          data: { 
            label: 'Check BNP Levels',
            condition: 'patient.bnp > 100'
          }
        },
        {
          id: 'adjust-medications',
          type: 'action',
          data: { 
            label: 'Adjust Medications',
            action: 'adjustHeartFailureMeds'
          }
        },
        {
          id: 'schedule-followup',
          type: 'action',
          data: { 
            label: 'Schedule Follow-up',
            action: 'scheduleHeartFailureFollowup'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check-weight' },
        { id: 'e2', source: 'check-weight', target: 'check-symptoms' },
        { id: 'e3', source: 'check-symptoms', target: 'check-bnp' },
        { id: 'e4', source: 'check-bnp', target: 'adjust-medications' },
        { id: 'e5', source: 'adjust-medications', target: 'schedule-followup' },
        { id: 'e6', source: 'schedule-followup', target: 'end' }
      ]
    }
  },
  {
    id: 'asthma-management',
    name: 'Asthma Management',
    description: 'Workflow for asthma control and exacerbation prevention',
    type: 'clinical',
    template: {
      nodes: [
        {
          id: 'start',
          type: 'start',
          data: { label: 'Start' }
        },
        {
          id: 'check-control',
          type: 'condition',
          data: { 
            label: 'Check Asthma Control',
            condition: 'patient.asthmaControlScore < 20'
          }
        },
        {
          id: 'check-triggers',
          type: 'condition',
          data: { 
            label: 'Check Triggers',
            condition: 'patient.hasAsthmaTriggers'
          }
        },
        {
          id: 'check-peak-flow',
          type: 'condition',
          data: { 
            label: 'Check Peak Flow',
            condition: 'patient.peakFlow < 80'
          }
        },
        {
          id: 'adjust-treatment',
          type: 'action',
          data: { 
            label: 'Adjust Treatment',
            action: 'adjustAsthmaTreatment'
          }
        },
        {
          id: 'schedule-review',
          type: 'action',
          data: { 
            label: 'Schedule Review',
            action: 'scheduleAsthmaReview'
          }
        },
        {
          id: 'end',
          type: 'end',
          data: { label: 'End' }
        }
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'check-control' },
        { id: 'e2', source: 'check-control', target: 'check-triggers' },
        { id: 'e3', source: 'check-triggers', target: 'check-peak-flow' },
        { id: 'e4', source: 'check-peak-flow', target: 'adjust-treatment' },
        { id: 'e5', source: 'adjust-treatment', target: 'schedule-review' },
        { id: 'e6', source: 'schedule-review', target: 'end' }
      ]
    }
  }
]; 