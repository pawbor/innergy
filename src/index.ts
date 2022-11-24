export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType =
  | "Photography"
  | "VideoRecording"
  | "BlurayPackage"
  | "TwoDayEvent"
  | "WeddingSession";

const mainTypeMap = new Map<ServiceType, ServiceType>([
  ["BlurayPackage", "VideoRecording"],
]);

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
  return [];
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
  const mainType = mainTypeMap.get(service);
  return !mainType || selectedServices.has(mainType);
}

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => ({ basePrice: 0, finalPrice: 0 });
