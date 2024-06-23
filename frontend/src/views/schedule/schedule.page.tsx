import { PageHeader } from "components/pageHeader.tsx";
import { Stack } from "components/stack.ts";
import Timeline from "react-calendar-timeline";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ScheduleViewModel } from "src/views/schedule/schedule.vm.ts";
import { Text } from "components/text.ts";
import { Tooltip } from "components/tooltip.tsx";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { Input } from "components/input.tsx";
import moment from "moment";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import { CustomDropdown } from "components/dropdown.tsx";
import { Button } from "components/button.tsx";
import { toast } from "react-toastify";
import { InternalLink } from "components/internalLink.tsx";
import PermissionsService from "src/stores/permissions.service.ts";

const SchedulePage = observer(() => {
  const [vm] = useState(() => new ScheduleViewModel());
  const theme = useTheme();

  const onDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Расписание успешно обновлено");
    // RequestsEndpoint.autoDistribute().then((data) => console.log(data));
  };

  return (
    <Stack direction={"column"} gap={8}>
      <Stack justify={"space-between"} align={"center"}>
        <Stack direction={"column"} gap={10}>
          <PageHeader>Расписание</PageHeader>
          <Input
            type={"date"}
            defaultValue={vm.currentDate.format("YYYY-MM-DD")}
            onChange={(e) => vm.setCurrentDate(moment(e))}
          />
        </Stack>
        <form onSubmit={onDistribute}>
          <Stack gap={20} align={"center"}>
            <CustomDropdown
              onChange={() => {}}
              options={[
                "Распределение всех заявок",
                "Распределение нераспределенных заявок",
              ]}
            />
            <Button type={"submit"}>Распределить заявки</Button>
          </Stack>
        </form>
      </Stack>
      {vm.isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : vm.items.length === 0 ? (
        <LoaderWrapper>
          <Text>За этот день нет записей</Text>
        </LoaderWrapper>
      ) : (
        <TimelineWrapper>
          <Timeline
            groups={vm.groups}
            traditionalZoom={true}
            minZoom={60 * 30 * 1000 * 13}
            maxZoom={60 * 60 * 1000 * 24 * 15}
            sidebarWidth={164}
            groupRenderer={({ group }) => {
              return (
                <div>
                  <InternalLink
                    to={`/staff/${group.id}`}
                    disabled={!PermissionsService.canRead("staff")}
                  >
                    <Text preWrap={false} size={14}>
                      {group.title}
                    </Text>
                  </InternalLink>
                </div>
              );
            }}
            canChangeGroup={false}
            items={vm.items}
            itemRenderer={({ item, getItemProps }) => {
              return (
                <div
                  {...getItemProps({
                    style: {
                      background: "transparent",
                      height: "100%",
                      borderRadius: "4px",
                      border: `2px solid ${item.color}`,
                      fontSize: "24px",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    },
                  })}
                >
                  <Stack
                    direction={"column"}
                    gap={4}
                    justify={"center"}
                    align={"center"}
                  >
                    <Tooltip content={item.title} action={"click"}>
                      <Link to={item.link}>
                        <Text
                          preWrap={false}
                          align={"center"}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          size={14}
                          color={theme.colors.text}
                        >
                          {item.title}
                        </Text>
                      </Link>
                    </Tooltip>
                  </Stack>
                </div>
              );
            }}
            defaultTimeStart={vm.currentDate.clone().add(6, "hours")}
            defaultTimeEnd={vm.currentDate.clone().add(14, "hours")}
          />
        </TimelineWrapper>
      )}
    </Stack>
  );
});

export default SchedulePage;

const TimelineWrapper = styled.div`
  .react-calendar-timeline .rct-outer {
    display: block;
    overflow: hidden;
    white-space: nowrap;
  }

  .react-calendar-timeline .rct-scroll {
    display: inline-block;
    white-space: normal;
    vertical-align: top;
    overflow-x: scroll;
    overflow-y: hidden;
    -ms-touch-action: none;
    touch-action: none;
  }

  .react-calendar-timeline .rct-item:hover {
    z-index: 88;
  }

  .react-calendar-timeline .rct-item .rct-item-content {
    position: sticky;
    position: -webkit-sticky;
    left: 0px;
    overflow: hidden;
    display: inline-block;
    border-radius: 2px;
    padding: 0 6px;
    height: 100%;
  }

  .react-calendar-timeline .rct-sidebar {
    overflow: hidden;
    white-space: normal;
    display: inline-block;
    vertical-align: top;
    position: relative;
    box-sizing: border-box;
    border-right: 1px solid ${(p) => p.theme.colors.inputBorder};
  }

  .react-calendar-timeline .rct-sidebar .rct-sidebar-row {
    padding: 0 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
    margin: 0;
    border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};
  }

  .react-calendar-timeline .rct-sidebar .rct-sidebar-row.rct-sidebar-row-odd {
    background: transparent;
  }

  .react-calendar-timeline .rct-sidebar .rct-sidebar-row.rct-sidebar-row-even {
    background: transparent;
  }

  .react-calendar-timeline .rct-vertical-lines .rct-vl {
    position: absolute;
    border-left: 1px solid ${(p) => p.theme.colors.inputBorder};
    z-index: 30;
  }

  .react-calendar-timeline .rct-horizontal-lines {
    -webkit-user-select: none;
    -moz-user-select: -moz-none;
    -ms-user-select: none;
    user-select: none;
  }

  .react-calendar-timeline .rct-horizontal-lines .rct-hl-even,
  .react-calendar-timeline .rct-horizontal-lines .rct-hl-odd {
    border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};
    box-sizing: border-box;
    z-index: 40;
  }

  .react-calendar-timeline .rct-horizontal-lines .rct-hl-odd {
    background: transparent;
  }

  .react-calendar-timeline .rct-horizontal-lines .rct-hl-even {
    background: transparent;
  }

  .react-calendar-timeline .rct-cursor-line {
    position: absolute;
    width: 2px;
    background: #2196f3;
    z-index: 51;
  }

  .react-calendar-timeline .rct-dateHeader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};
    cursor: pointer;
    font-size: 14px;
    background-color: #fff;
    border-left: 1px solid ${(p) => p.theme.colors.inputBorder};
  }

  .react-calendar-timeline .rct-dateHeader-primary {
    background-color: #fff;
    border-left: 1px solid ${(p) => p.theme.colors.inputBorder};
    border-right: 1px solid ${(p) => p.theme.colors.inputBorder};
    color: #000;
    font-weight: 700;
  }

  .react-calendar-timeline .rct-header-root {
    background: #fff;
    border-bottom: 1px solid ${(p) => p.theme.colors.inputBorder};
  }

  .react-calendar-timeline .rct-calendar-header {
    border: 1px solid ${(p) => p.theme.colors.inputBorder};
  }
`;
