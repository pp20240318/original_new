import { Tabs, TabPane } from "@douyinfe/semi-ui";
import TabContent from "./TabContent";
import CountdownMask from "./CountdownMask";

export default function TabContentBox({
  start,
  dataFromChild,
  active,
  onChange,
}: {
  dataFromChild: RacingBetItem[];
  start: boolean;
  active: number;
  onChange?: () => void;
}) {
  const tabsList = [
    {
      value: "Total",
      title: "Champion runner-up",
    },
    {
      value: "1",
      title: "Join 1st place",
    },
    {
      value: "2",
      title: "Join 2nd place",
    },
    {
      value: "3",
      title: "Join 3rd place",
    },
    {
      value: "4",
      title: "Join 4th place",
    },
    {
      value: "5",
      title: "Join 5th place",
    },
    {
      value: "6",
      title: "Join 6th place",
    },
    {
      value: "7",
      title: "Join 7th place",
    },
    {
      value: "8",
      title: "Join 8th place",
    },
    {
      value: "9",
      title: "Join 9th place",
    },
    {
      value: "10",
      title: "Join 10th place",
    },
  ];

  return (
    <div className="bg-base-900 w-full relative">
      <CountdownMask start={start} />
      <Tabs className="custom-tabs" type="line" collapsible>
        {tabsList.map((i) => (
          <TabPane tab={`${i.title}`} itemKey={`Tab-${i.value}`} key={i.value}>
            <TabContent
              itemContent={i}
              dataFromChild={dataFromChild}
              active={active}
              start={start}
              tabValue={i.value}
              tabsList={tabsList}
              onChange={() => onChange?.()}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
