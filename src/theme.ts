import { ActionIcon, Group, Tooltip, createTheme } from "@mantine/core";

export const theme = createTheme({
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "subtle",
        size: "lg"
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        openDelay: 300
      }
    }),
    Group: Group.extend({
    })
  }
})
