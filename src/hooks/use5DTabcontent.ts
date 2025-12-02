import { createGlobalStore } from "@/hooks/useGlobalState";

export const use5DTabcontent = createGlobalStore("use5DTabcontent", {
  activeTabIndex: 0,
  showPopup: false,
  bigActive: -1,
  activeTabContent: "",
  bigTabContent: "",
});
