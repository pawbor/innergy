export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType =
  | "Photography"
  | "VideoRecording"
  | "BlurayPackage"
  | "TwoDayEvent"
  | "WeddingSession";

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

const normalPrices: Record<ServiceYear, Record<ServiceType, number>> = {
  2020: {
    Photography: 1700,
    VideoRecording: 1700,
    WeddingSession: 600,
    BlurayPackage: 300,
    TwoDayEvent: 400,
  },
  2021: {
    Photography: 1800,
    VideoRecording: 1800,
    WeddingSession: 600,
    BlurayPackage: 300,
    TwoDayEvent: 400,
  },
  2022: {
    Photography: 1900,
    VideoRecording: 1900,
    WeddingSession: 600,
    BlurayPackage: 300,
    TwoDayEvent: 400,
  },
};

interface ConflictingDiscountRules {
  conflictingRules: DiscountRule[];
}

interface DiscountRule {
  services: ServiceType[];
  discount: number;
}

const discountRulesByYear: Record<ServiceYear, ConflictingDiscountRules[]> = {
  2020: [
    {
      conflictingRules: [
        {
          services: ["WeddingSession", "Photography"],
          discount: 300,
        },
        {
          services: ["WeddingSession", "VideoRecording"],
          discount: 300,
        },
      ],
    },
    {
      conflictingRules: [
        {
          services: ["VideoRecording", "Photography"],
          discount: 1200,
        },
      ],
    },
  ],
  2021: [
    {
      conflictingRules: [
        {
          services: ["WeddingSession", "Photography"],
          discount: 300,
        },
        {
          services: ["WeddingSession", "VideoRecording"],
          discount: 300,
        },
      ],
    },
    {
      conflictingRules: [
        {
          services: ["VideoRecording", "Photography"],
          discount: 1300,
        },
      ],
    },
  ],
  2022: [
    {
      conflictingRules: [
        {
          services: ["WeddingSession", "Photography"],
          discount: 600,
        },
        {
          services: ["WeddingSession", "VideoRecording"],
          discount: 300,
        },
      ],
    },
    {
      conflictingRules: [
        {
          services: ["VideoRecording", "Photography"],
          discount: 1300,
        },
      ],
    },
  ],
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  const basePrice = calculateBasePrice(selectedServices, selectedYear);
  const discount = calculateTotalDiscount(selectedServices, selectedYear);

  return { basePrice, finalPrice: basePrice - discount };
};

function calculateBasePrice(
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) {
  return sumMany(
    selectedServices.map((service) => normalPrices[selectedYear][service])
  );
}

function calculateTotalDiscount(
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) {
  const selectedServicesSet = new Set(selectedServices);
  const discountsToApply = discountRulesByYear[selectedYear].map(
    findGreatestMatchingDiscount
  );

  return sumMany(discountsToApply);

  function findGreatestMatchingDiscount({
    conflictingRules,
  }: ConflictingDiscountRules): number {
    return Math.max(0, ...findMatchingDiscounts(conflictingRules));
  }

  function findMatchingDiscounts(rules: DiscountRule[]): number[] {
    return rules
      .filter(({ services }) =>
        services.every((service) => selectedServicesSet.has(service))
      )
      .map(({ discount }) => discount);
  }
}

function sumMany(values: number[]) {
  return values.reduce(sum2, 0);
}

function sum2(x: number, y: number) {
  return x + y;
}
