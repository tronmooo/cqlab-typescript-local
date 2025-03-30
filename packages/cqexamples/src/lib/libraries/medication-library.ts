import { TernaryEnum } from '@cqlab/cqflow-core';
import {
  Library,
  Define,
  Documentation,
  ReturnType,
  MockData,
  FhirLibrary,
  Params,
} from '@cqlab/cqdefine';
import * as z from 'zod';
import { MockPatientIdEnum } from '../mock-patients';

const makeMockDataItem = (id: MockPatientIdEnum) => ({ id: id, label: id });

// Define schemas for different medication-related types
const medicationSchema = z.object({
  code: z.string(),
  display: z.string(),
  active: z.boolean(),
  startDate: z.string().nullable(),
});
type Medication = z.infer<typeof medicationSchema>;

const medicationListSchema = z.array(medicationSchema);
type MedicationList = z.infer<typeof medicationListSchema>;

// For parameterized queries
const medicationCodeSchema = z.string();
type MedicationCode = z.infer<typeof medicationCodeSchema>;

// Define a type for FHIR medication request based on the expected structure
interface MedicationRequest {
  status?: string;
  medicationCodeableConcept?: {
    coding?: Array<{
      code?: string;
      display?: string;
    }>;
  };
  authoredOn?: string;
}

@Library('MedicationLibrary')
@MockData([
  makeMockDataItem(MockPatientIdEnum.empty_data),
  makeMockDataItem(MockPatientIdEnum.high_cholesterol),
])
export class MedicationLibrary extends FhirLibrary {
  // Helper method to get medication requests
  private async getMedicationRequests(): Promise<MedicationRequest[]> {
    // This would typically call this.retriever.getMedicationRequests()
    // Since the method doesn't exist, we're mocking it here
    
    // Mock implementation - in a real scenario, you would use the actual retriever method
    return [];
  }

  // Get all active medications for a patient
  @Define('Get active medications')
  @Documentation('Retrieves a list of all active medications for the patient')
  @ReturnType(medicationListSchema)
  async getActiveMedications(): Promise<MedicationList> {
    const allMedications = await this.getMedicationRequests();
    
    // Filter for active medications and map to our return type
    return allMedications
      .filter(med => med.status === 'active')
      .map(med => ({
        code: med.medicationCodeableConcept?.coding?.[0]?.code || 'unknown',
        display: med.medicationCodeableConcept?.coding?.[0]?.display || 'Unknown Medication',
        active: med.status === 'active',
        startDate: med.authoredOn || null,
      }));
  }

  // Check if patient is on a specific medication by code
  @Define('Is on medication')
  @Params(medicationCodeSchema)
  @Documentation('Checks if the patient is currently on a specific medication by medication code')
  async isOnMedication(medicationCode: MedicationCode): Promise<TernaryEnum> {
    const activeMedications = await this.getActiveMedications();
    
    if (activeMedications.length === 0) {
      return TernaryEnum.UNKNOWN;
    }
    
    const isOnMed = activeMedications.some(med => med.code === medicationCode);
    return isOnMed ? TernaryEnum.TRUE : TernaryEnum.FALSE;
  }

  // Count the total number of active medications
  @Define('Get active medication count')
  @Documentation('Returns the total number of active medications for the patient')
  @ReturnType(z.number())
  async getActiveMedicationCount(): Promise<number> {
    const activeMedications = await this.getActiveMedications();
    return activeMedications.length;
  }

  // Check if patient is on multiple medications (polypharmacy)
  @Define('Is on multiple medications')
  @Documentation('Determines if the patient is on multiple medications (2 or more)')
  async isOnMultipleMedications(): Promise<TernaryEnum> {
    const count = await this.getActiveMedicationCount();
    return count >= 2 ? TernaryEnum.TRUE : TernaryEnum.FALSE;
  }
} 