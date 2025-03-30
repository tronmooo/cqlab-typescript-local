export * from './breast-cancer-screening-library';
export * from './medication-library';

import { LibraryContainer } from '@cqlab/cqdefine';
import { BreastCancerScreeningLibrary } from './breast-cancer-screening-library';
import { BasicRetrieveLibrary } from './docs-basic-retrieve';
import { ParameterizedRetrieveLibrary } from './docs-parameterized-retrieve';
import { MedicationLibrary } from './medication-library';

export const libraryContainer = new LibraryContainer();
libraryContainer.add(BreastCancerScreeningLibrary);
libraryContainer.add(BasicRetrieveLibrary);
libraryContainer.add(ParameterizedRetrieveLibrary);
libraryContainer.add(MedicationLibrary);
