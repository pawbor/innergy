import { ServiceType, ServiceYear } from "./model";

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
