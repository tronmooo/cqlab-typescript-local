export * from './breast-cancer-screening-interactive-context';
import { NonInteractiveBreastCancerScreeningContext } from './breast-cancer-screening-interactive-context';
import {
  ExecNode,
  TernaryEnum,
  NonInteractiveFlowImplementation,
} from '@cqlab/cqflow-core';

// Create an enum for the node bindings defined in the flow definition
// These bindings are used to map a node definition to node implementation
enum BreastCancerScreeningEnum {
  is_female = 'is_female',
  is_over_45 = 'is_over_45_years_old',
  has_had_breast_cancer_screening_in_last_2_years = 'has_had_breast_cancer_screening_in_last_2_years',
}

// Create an ExecNode that uses the breastCancerScreeningLibrary library to
// make a calculation using patient data
class IsFemale extends ExecNode<NonInteractiveBreastCancerScreeningContext> {
  override async evaluate(
    context: NonInteractiveBreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.isFemale();
  }
}

class IsOver45 extends ExecNode<NonInteractiveBreastCancerScreeningContext> {
  override async evaluate(
    context: NonInteractiveBreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.isOver45();
  }
}

class HasHadBreastCancerScreeningInLast2Years extends ExecNode<NonInteractiveBreastCancerScreeningContext> {
  override async evaluate(
    context: NonInteractiveBreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.hadBreastCancerScreeningInLast2Years();
  }
}

// Instantiate the flow implementation and register the nodes
export const nonInteractiveBreastCancerScreeningImplementation =
  new NonInteractiveFlowImplementation<NonInteractiveBreastCancerScreeningContext>();

nonInteractiveBreastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.is_female,
  (nodeDef) => new IsFemale(nodeDef)
);

nonInteractiveBreastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.is_over_45,
  (nodeDef) => new IsOver45(nodeDef)
);

nonInteractiveBreastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.has_had_breast_cancer_screening_in_last_2_years,
  (nodeDef) => new HasHadBreastCancerScreeningInLast2Years(nodeDef)
);
