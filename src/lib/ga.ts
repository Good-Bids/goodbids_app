export const pageview = (url: string): void => {
  if (window !== undefined) {
    (window as any).gtag("config", "G-CXJ4181QHF", {
      page_path: url,
    });
  }
};

export const event = ({
  action,
  params,
}: {
  action: string;
  params: any;
}): void => {
  if (window !== undefined) {
    (window as any).gtag("event", action, params);
  }
};
