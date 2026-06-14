"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tree, Folder, File } from "@/components/ui/file-tree"
import { Heart, Menu } from "lucide-react"

const MESSAGES_TREE = [
  {
    id: "folder-1",
    name: "Our First Meeting",
    type: "folder" as const,
    children: [
      { id: "msg-1", name: "The day you smiled.txt", type: "file" as const },
      { id: "msg-2", name: "Butterflies.md", type: "file" as const },
    ],
  },
  {
    id: "folder-2",
    name: "Midnight Talks",
    type: "folder" as const,
    children: [
      { id: "msg-3", name: "Secrets.json", type: "file" as const },
      { id: "msg-4", name: "Dreams_we_share.doc", type: "file" as const },
    ],
  },
  {
    id: "folder-3",
    name: "Future Plans",
    type: "folder" as const,
    children: [
      { id: "msg-5", name: "House_with_a_garden.png", type: "file" as const },
      { id: "msg-6", name: "Our_cats.jpg", type: "file" as const },
      {
        id: "folder-4",
        name: "Vacations",
        type: "folder" as const,
        children: [
          { id: "msg-7", name: "Japan_Itinerary.pdf", type: "file" as const },
        ],
      },
    ],
  },
  { id: "msg-8", name: "I_LOVE_YOU.exe", type: "file" as const },
]

export function AppSidebar() {
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="border-r-[3px] border-[#160029] bg-white/50 glass">
      <SidebarHeader className="p-4 border-b-[3px] border-[#160029] flex justify-between items-center flex-row">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary animate-heartbeat" />
          <span className="font-bold text-lg" style={{ fontFamily: "var(--font-playfair), serif" }}>Messages for You</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold tracking-wider">SYSTEM://HEART</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <div className="relative h-[400px] w-full rounded-xl border-[2.5px] border-[#160029] bg-white/50 p-2 comic-panel overflow-hidden">
              <Tree
                elements={MESSAGES_TREE}
                className="w-full h-full"
              >
                {MESSAGES_TREE.map((element) => (
                  <TreeItem key={element.id} element={element} />
                ))}
              </Tree>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function TreeItem({ element }: { element: any }) {
  if (element.type === "folder") {
    return (
      <Folder element={element.name} value={element.id}>
        {element.children?.map((child: any) => (
          <TreeItem key={child.id} element={child} />
        ))}
      </Folder>
    )
  }
  return <File value={element.id}><p className="font-medium text-xs truncate">{element.name}</p></File>
}
