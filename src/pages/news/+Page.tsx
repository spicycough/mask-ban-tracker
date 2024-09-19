import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-solid";
import { For, type JSX } from "solid-js";

interface MetadataItem {
  icon: JSX.Element;
  value: string;
}

interface ChangelogItem {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  metadata: {
    status: MetadataItem;
    createdDate: MetadataItem;
    updatedDate: MetadataItem;
    resolvedDate?: MetadataItem;
  };
}

export default function Page() {
  const changelogData: ChangelogItem[] = [
    {
      id: 1,
      title: "New Feature: Dark Mode",
      content:
        "We've added a dark mode option to improve visibility in low-light environments and reduce eye strain. This feature has been highly requested by our users and we're excited to finally roll it out. The dark mode can be toggled in the user settings and will remember your preference for future sessions.",
      author: "Jane Doe",
      tags: ["feature", "ui"],
      metadata: {
        status: {
          icon: <CheckCircleIcon class="h-4 w-4 text-green-500" />,
          value: "Completed",
        },
        createdDate: {
          icon: <CalendarIcon class="h-4 w-4" />,
          value: "2023-08-10",
        },
        updatedDate: {
          icon: <ClockIcon class="h-4 w-4" />,
          value: "2023-08-15",
        },
      },
    },
    {
      id: 2,
      title: "Bug Fix: Login Issues",
      content:
        "We're currently investigating and fixing an issue where some users are unable to log in due to a caching problem. Our team has identified the root cause and is working on implementing a solution. We appreciate your patience as we work to resolve this issue. In the meantime, clearing your browser cache may help as a temporary workaround.",
      author: "John Smith",
      tags: ["bug fix", "in progress"],
      metadata: {
        status: {
          icon: <AlertTriangleIcon class="h-4 w-4 text-yellow-500" />,
          value: "In Progress",
        },
        createdDate: {
          icon: <CalendarIcon class="h-4 w-4" />,
          value: "2023-08-12",
        },
        updatedDate: {
          icon: <ClockIcon class="h-4 w-4" />,
          value: "2023-08-14",
        },
      },
    },
  ];

  return (
    <div class="h-[600px] w-full rounded-md border p-4">
      <h1 class="mb-6 font-bold text-3xl">Changelog</h1>
      <div class="space-y-6">
        <For each={changelogData}>
          {(item) => (
            <Card class="flex flex-col md:flex-row">
              <div class="w-full bg-muted p-6 md:w-1/3">
                <div class="space-y-4">
                  <For each={Object.values(item.metadata)}>
                    {(meta) => (
                      <div class="flex items-center space-x-2">
                        {meta.icon}
                        <span class="text-muted-foreground text-sm">
                          {meta.value}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <div class="flex-1">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="mb-4">{item.content}</p>
                </CardContent>
                <CardFooter class="flex flex-wrap items-center justify-between text-muted-foreground text-sm">
                  <span>{item.author}</span>
                  <div class="mt-2 flex flex-wrap gap-2 sm:mt-0">
                    <For each={item.tags}>
                      {(tag) => <Badge variant="secondary">{tag}</Badge>}
                    </For>
                  </div>
                </CardFooter>
              </div>
            </Card>
          )}
        </For>
      </div>
    </div>
  );
}
