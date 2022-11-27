import { updateSelectedServices } from "./updateSelectedServices";

describe("updateSelectedServices", () => {
  describe("select", () => {
    test("should select when not selected", () => {
      const result = updateSelectedServices([], {
        type: "Select",
        service: "Photography",
      });
      expect(result).toEqual(["Photography"]);
    });

    test("should not select the same service twice", () => {
      const result = updateSelectedServices(["Photography"], {
        type: "Select",
        service: "Photography",
      });
      expect(result).toEqual(["Photography"]);
    });

    test("should not select related service when main service is not selected", () => {
      const result = updateSelectedServices(["WeddingSession"], {
        type: "Select",
        service: "BlurayPackage",
      });
      expect(result).toEqual(["WeddingSession"]);
    });

    test("should select related service when main service is selected", () => {
      const result = updateSelectedServices(
        ["WeddingSession", "VideoRecording"],
        {
          type: "Select",
          service: "BlurayPackage",
        }
      );
      expect(result).toEqual([
        "WeddingSession",
        "VideoRecording",
        "BlurayPackage",
      ]);
    });

    test("should select related service when one of main services is selected", () => {
      const result = updateSelectedServices(["WeddingSession", "Photography"], {
        type: "Select",
        service: "TwoDayEvent",
      });
      expect(result).toEqual(["WeddingSession", "Photography", "TwoDayEvent"]);
    });
  });

  describe("deselect", () => {
    test("should deselect", () => {
      const result = updateSelectedServices(["WeddingSession", "Photography"], {
        type: "Deselect",
        service: "Photography",
      });
      expect(result).toEqual(["WeddingSession"]);
    });

    test("should do nothing when service not selected", () => {
      const result = updateSelectedServices(["WeddingSession", "Photography"], {
        type: "Deselect",
        service: "TwoDayEvent",
      });
      expect(result).toEqual(["WeddingSession", "Photography"]);
    });

    test("should deselect related when last main service deselected", () => {
      const result = updateSelectedServices(
        ["WeddingSession", "Photography", "TwoDayEvent"],
        {
          type: "Deselect",
          service: "Photography",
        }
      );
      expect(result).toEqual(["WeddingSession"]);
    });

    test("should not deselect related when at least one main service stays selected", () => {
      const result = updateSelectedServices(
        ["WeddingSession", "Photography", "VideoRecording", "TwoDayEvent"],
        {
          type: "Deselect",
          service: "Photography",
        }
      );
      expect(result).toEqual([
        "WeddingSession",
        "VideoRecording",
        "TwoDayEvent",
      ]);
    });
  });
});
