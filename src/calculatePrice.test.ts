import { calculatePrice } from "./calculatePrice";
import { ServiceType, ServiceYear } from "./model";

describe("calculatePrice", () => {
  describe.each([2020, 2021, 2022] as const)(
    "zero (%i)",
    (year: ServiceYear) => {
      test("should be zero with no services selected", () => {
        const result = calculatePrice([], year);
        expect(result).toEqual({ basePrice: 0, finalPrice: 0 });
      });
    }
  );

  describe.each([
    ["WeddingSession", 2020, 600],
    ["WeddingSession", 2021, 600],
    ["WeddingSession", 2022, 600],
    ["Photography", 2020, 1700],
    ["Photography", 2021, 1800],
    ["Photography", 2022, 1900],
    ["VideoRecording", 2020, 1700],
    ["VideoRecording", 2021, 1800],
    ["VideoRecording", 2022, 1900],
  ] as const)(
    "singleService (%s, %i)",
    (service: ServiceType, year: ServiceYear, expectedPrice) => {
      test("no discount applied", () => {
        const result = calculatePrice([service], year);
        expect(result.basePrice).toBeGreaterThan(0);
        expect(result.finalPrice).toBeGreaterThan(0);
        expect(result.basePrice).toBe(result.finalPrice);
      });

      test("price matches requirements", () => {
        const result = calculatePrice([service], year);
        expect(result).toEqual({
          basePrice: expectedPrice,
          finalPrice: expectedPrice,
        });
      });
    }
  );

  describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 300],
  ] as const)("BlurayPackage (%i, %i)", (year: ServiceYear, expectedPrice) => {
    test("price matches requirements", () => {
      const onlyVideoRecording = calculatePrice(["VideoRecording"], year);
      const withBlurayPackage = calculatePrice(
        ["VideoRecording", "BlurayPackage"],
        year
      );
      const result =
        withBlurayPackage.finalPrice - onlyVideoRecording.finalPrice;
      expect(result).toEqual(expectedPrice);
    });
  });

  describe.each([
    [2020, 400],
    [2021, 400],
    [2022, 400],
  ] as const)("TwoDayEvent (%i, %i)", (year: ServiceYear, expectedPrice) => {
    test("price matches requirements", () => {
      const onlyVideo = calculatePrice(["VideoRecording"], year);
      const withTwoDayEvent = calculatePrice(
        ["VideoRecording", "TwoDayEvent"],
        year
      );
      const result = withTwoDayEvent.finalPrice - onlyVideo.finalPrice;
      expect(result).toEqual(expectedPrice);
    });
  });

  describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 0],
  ] as const)(
    "photographyWithWeddingSessionPrice (%i increase by %i)",
    (year: ServiceYear, increase) => {
      test("price matches requirements", () => {
        const withoutSession = calculatePrice(["Photography"], year);
        const withSession = calculatePrice(
          ["Photography", "WeddingSession"],
          year
        );

        const priceChangeWithSession =
          withSession.finalPrice - withoutSession.finalPrice;

        expect(withSession.basePrice).toBeGreaterThan(0);
        expect(withSession.finalPrice).toBeGreaterThan(0);
        expect(priceChangeWithSession).toEqual(increase);
      });

      test("discount applied", () => {
        const withoutSession = calculatePrice(["Photography"], year);
        const onlySession = calculatePrice(["WeddingSession"], year);
        const withSession = calculatePrice(
          ["Photography", "WeddingSession"],
          year
        );

        const priceWithoutDiscounts =
          withoutSession.finalPrice + onlySession.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
      });
    }
  );

  describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 300],
  ] as const)(
    "videoRecordingWithWeddingSessionPrice (%i increase by %i)",
    (year: ServiceYear, increase) => {
      test("price matches requirements", () => {
        const withoutSession = calculatePrice(["VideoRecording"], year);
        const withSession = calculatePrice(
          ["VideoRecording", "WeddingSession"],
          year
        );

        const priceChangeWithSession =
          withSession.finalPrice - withoutSession.finalPrice;

        expect(priceChangeWithSession).toEqual(increase);
      });

      test("discount applied", () => {
        const withoutSession = calculatePrice(["VideoRecording"], year);
        const onlySession = calculatePrice(["WeddingSession"], year);
        const withSession = calculatePrice(
          ["VideoRecording", "WeddingSession"],
          year
        );

        const priceWithoutDiscounts =
          withoutSession.finalPrice + onlySession.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
      });
    }
  );

  describe.each([
    [2020, 500],
    [2021, 500],
    [2022, 600],
  ] as const)(
    "videoRecordingWithPhotographyPrice (%i increase by %i)",
    (year: ServiceYear, increase) => {
      test("price matches requirements", () => {
        const withoutPhotography = calculatePrice(["VideoRecording"], year);
        const withPhotography = calculatePrice(
          ["VideoRecording", "Photography"],
          year
        );

        const priceChangeWithPhotography =
          withPhotography.finalPrice - withoutPhotography.finalPrice;

        expect(priceChangeWithPhotography).toEqual(increase);
      });

      test("discount applied", () => {
        const withoutPhotography = calculatePrice(["VideoRecording"], year);
        const onlyPhotography = calculatePrice(["Photography"], year);
        const withPhotography = calculatePrice(
          ["VideoRecording", "Photography"],
          year
        );

        const priceWithoutDiscounts =
          withoutPhotography.finalPrice + onlyPhotography.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(
          withPhotography.finalPrice
        );
      });
    }
  );

  describe.each([
    [2020, 300],
    [2021, 300],
    [2022, 0],
  ] as const)(
    "videoRecordingWithPhotographyWithSessionPrice (%i increase by %i)",
    (year: ServiceYear, increase) => {
      test("price matches requirements", () => {
        const withoutSession = calculatePrice(
          ["VideoRecording", "Photography"],
          year
        );
        const withSession = calculatePrice(
          ["VideoRecording", "Photography", "WeddingSession"],
          year
        );

        const priceChangeWithSession =
          withSession.finalPrice - withoutSession.finalPrice;

        expect(withSession.basePrice).toBeGreaterThan(0);
        expect(withSession.finalPrice).toBeGreaterThan(0);
        expect(priceChangeWithSession).toEqual(increase);
      });

      test("discount applied", () => {
        const withoutSession = calculatePrice(
          ["VideoRecording", "Photography"],
          year
        );
        const onlySession = calculatePrice(["WeddingSession"], year);
        const withSession = calculatePrice(
          ["VideoRecording", "Photography", "WeddingSession"],
          year
        );

        const priceWithoutDiscounts =
          withoutSession.finalPrice + onlySession.finalPrice;

        expect(priceWithoutDiscounts).toBeGreaterThan(withSession.finalPrice);
      });
    }
  );
});
