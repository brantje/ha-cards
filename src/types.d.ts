type CustomCardEntry = {
  type: string;
  name: string;
  description: string;
};

interface Window {
  customCards?: CustomCardEntry[];
  loadCardHelpers?: () => Promise<{
    createCardElement: (config: Record<string, any>) => Promise<{
      constructor: {
        getConfigElement: () => Promise<HTMLElement>;
      };
    }>;
  }>;
}
