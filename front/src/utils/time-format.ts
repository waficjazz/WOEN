import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import round from "javascript-time-ago/steps";

const customLabels = {
  second: {
    past: {
      one: "{0}s ago",
      other: "{0}s ago",
    },
    future: {
      one: "{0}second later",
      other: "{0}seconds later",
    },
  },
  minute: {
    past: {
      one: "{0}m ago",
      other: "{0}m ago",
    },
    future: {
      one: "{0}minute later",
      other: "{0}minutes later",
    },
  },
  hour: {
    past: {
      one: "{0}h ago",
      other: "{0}h ago",
    },
    future: {
      one: "{0}hour later",
      other: "{0}hours later",
    },
  },
  day: {
    past: {
      one: "{0}d ago",
      other: "{0}d ago",
    },
    future: {
      one: "{0}day later",
      other: "{0}days later",
    },
  },
  week: {
    past: {
      one: "{0}w ago",
      other: "{0}w ago",
    },
    future: {
      one: "{0}week later",
      other: "{0}weeks later",
    },
  },
  year: {
    past: {
      one: "{0}y ago",
      other: "{0}y ago",
    },
    future: {
      one: "{0}year later",
      other: "{0}years later",
    },
  },
  month: {
    past: {
      one: "{0}month ago",
      other: "{0}months ago",
    },
    future: {
      one: "{0}month later",
      other: "{0}months later",
    },
  },
};

TimeAgo.addLabels("en", "custom", customLabels);

TimeAgo.addDefaultLocale(en);

export const timeAgo = new TimeAgo("en-US");
export const dateStyle = {
  steps: round,
  labels: "custom",
};

export function getDuration(startDate: Date, endDate: Date): string {
  let diff = endDate.getTime() - startDate.getTime();

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  let hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  let minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  let seconds = Math.floor(diff / 1000);

  if (days > 0) {
    return `${days} d`;
  } else if (hours > 0) {
    return `${hours} h`;
  } else if (minutes > 0) {
    return `${minutes} m`;
  } else {
    return `${seconds} s`;
  }
}
