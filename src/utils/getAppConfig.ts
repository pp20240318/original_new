export const getAppConfig = async (filename: string) => {
  const res = await fetch(`/config/${filename}.json`);
  const config = await res.json();
  return config as AppConfig;
};
