import { ReactNode, ReactElement, Children, useState, useEffect } from 'react';
import { Tabs as CarbonTabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';

type RootProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
};

type TriggerInfo = {
  value: string;
  children: ReactNode;
  dataTest?: string;
};

function Root(props: RootProps) {
  const { value, onValueChange, children } = props;
  const [triggers, setTriggers] = useState<TriggerInfo[]>([]);
  const [contents, setContents] = useState<Array<{ value: string; children: ReactNode }>>([]);

  useEffect(() => {
    const triggersArray: TriggerInfo[] = [];
    const contentsArray: Array<{ value: string; children: ReactNode }> = [];

    Children.forEach(children, (child: any) => {
      if (child?.type === List) {
        Children.forEach(child.props.children, (trigger: any) => {
          if (trigger?.type === Trigger) {
            triggersArray.push({
              value: trigger.props.value,
              children: trigger.props.children,
              dataTest: trigger.props['data-test'],
            });
          }
        });
      } else if (child?.type === Content) {
        contentsArray.push({
          value: child.props.value,
          children: child.props.children,
        });
      }
    });

    setTriggers(triggersArray);
    setContents(contentsArray);
  }, [children]);

  const selectedIndex = triggers.findIndex((t) => t.value === value);

  const handleTabChange = (evt: any) => {
    const newIndex = evt.selectedIndex;
    if (triggers[newIndex]) {
      onValueChange(triggers[newIndex].value);
    }
  };

  return (
    <CarbonTabs selectedIndex={selectedIndex >= 0 ? selectedIndex : 0} onChange={handleTabChange}>
      <TabList aria-label="Tabs">
        {triggers.map((trigger) => (
          <Tab key={trigger.value} data-test={trigger.dataTest}>
            {trigger.children}
          </Tab>
        ))}
      </TabList>
      {contents.length > 0 && (
        <TabPanels>
          {triggers.map((trigger) => {
            const content = contents.find((c) => c.value === trigger.value);
            return <TabPanel key={trigger.value}>{content?.children || null}</TabPanel>;
          })}
        </TabPanels>
      )}
    </CarbonTabs>
  );
}

type ListProps = {
  children: ReactNode;
};

function List({ children }: ListProps) {
  return children as ReactElement;
}

type TriggerProps = {
  value: string;
  children: ReactNode;
  'data-test'?: string;
};

function Trigger({ children }: TriggerProps) {
  return children as ReactElement;
}

type ContentProps = {
  value: string;
  children: ReactNode;
};

function Content({ children }: ContentProps) {
  return children as ReactElement;
}

export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
};
