import { ServiceType } from "./model";

const relatedServicesMap = new Map<ServiceType, ServiceType[]>([
  ["VideoRecording", ["BlurayPackage", "TwoDayEvent"]],
  ["Photography", ["TwoDayEvent"]],
]);

const mainServicesMap = makeMainServicesMap();

function makeMainServicesMap() {
  const map = new Map<ServiceType, ServiceType[]>();
  relatedServicesMap.forEach((relatedServices, main) => {
    relatedServices.forEach((related) => {
      const mainServices = map.get(related) ?? [];
      if (!map.has(related)) {
        map.set(related, mainServices);
      }
      mainServices.push(main);
    });
  });
  return map;
}

interface DeselectAction {
  type: "Deselect";
  service: ServiceType;
}

interface SelectAction {
  type: "Select";
  service: ServiceType;
}

type Action = SelectAction | DeselectAction;

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: Action
): ServiceType[] => {
  if (action.type === "Select") {
    return selectService(previouslySelectedServices, action);
  }

  return deselectService(previouslySelectedServices, action);
};

function selectService(
  previouslySelectedServices: ServiceType[],
  action: SelectAction
): ServiceType[] {
  const { service } = action;
  const selectedServices = new Set(previouslySelectedServices);

  if (canSelect(service, selectedServices)) {
    selectedServices.add(service);
    return Array.from(selectedServices);
  }

  return previouslySelectedServices;
}

function canSelect(
  service: ServiceType,
  selectedServices: Set<ServiceType>
): boolean {
  const mainServices = mainServicesMap.get(service);
  return (
    !mainServices || mainServices.some((main) => selectedServices.has(main))
  );
}

function deselectService(
  previouslySelectedServices: ServiceType[],
  action: DeselectAction
): ServiceType[] {
  const { service } = action;
  const selectedServices = new Set(previouslySelectedServices);

  selectedServices.delete(service);
  deselectIfNoMain(relatedServicesMap.get(service) ?? [], selectedServices);
  return Array.from(selectedServices);
}

function deselectIfNoMain(
  candidates: ServiceType[],
  selectedServices: Set<ServiceType>
) {
  const [candidate, ...nextCandidates] = candidates;

  if (!candidate) {
    return;
  }

  if (canDeselect(candidate, selectedServices)) {
    selectedServices.delete(candidate);
    const related = relatedServicesMap.get(candidate) ?? [];
    nextCandidates.push(...related);
  }

  deselectIfNoMain(nextCandidates, selectedServices);
}

function canDeselect(
  service: ServiceType,
  selectedServices: Set<ServiceType>
): boolean {
  return !canSelect(service, selectedServices);
}
