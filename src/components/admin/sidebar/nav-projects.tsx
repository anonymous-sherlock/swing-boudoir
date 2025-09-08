import { Folder, MoreHorizontal, Share, Trash2, Download, type LucideIcon, Info } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useExportModels } from "@/hooks/api/useExport";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const exportModels = useExportModels();
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel');
  const [includeInactive, setIncludeInactive] = useState(false);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <MoreHorizontal />
                <span>More</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" side={isMobile ? "bottom" : "bottom"} align={isMobile ? "end" : "start"}>
              <DropdownMenuSub >
                <DropdownMenuSubTrigger className="cursor-pointer gap-2 flex items-center">
                  <Download className="text-black size-4" />
                  <span>Export Models</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-80">
                  <div className="space-y-4 p-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Export Models</h4>
                      <p className="text-xs text-muted-foreground">Download all models data as Excel or CSV file</p>
                    </div>
                    
                    {/* Format Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Export Format</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={exportFormat === 'excel' ? 'default' : 'outline'}
                          size="xs"
                          onClick={() => setExportFormat('excel')}
                          className="flex-1"
                        >
                          Excel
                        </Button>
                        <Button
                          variant={exportFormat === 'csv' ? 'default' : 'outline'}
                          size="xs"
                          onClick={() => setExportFormat('csv')}
                          className="flex-1"
                        >
                          CSV
                        </Button>
                      </div>
                      {exportFormat === 'csv' && (
                        <p className="flex gap-1 flex-start text-xs text-amber-600 bg-amber-50 p-2 rounded border">
                          <Info className="w-4 h-4 text-yellow-500 flex shrink-0" /> CSV format only exports model profiles. Contest details are not supported in CSV format.
                        </p>
                      )}
                    </div>

                    {/* Include Inactive Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeInactive"
                        checked={includeInactive}
                        onCheckedChange={(checked) => setIncludeInactive(checked as boolean)}
                      />
                      <Label htmlFor="includeInactive" className="text-xs">
                        Include inactive models
                      </Label>
                    </div>

                    {/* Export Button */}
                    <Button 
                      onClick={() => exportModels.mutate({ 
                        format: exportFormat, 
                        includeInactive 
                      })} 
                      disabled={exportModels.isPending} 
                      className="w-full" 
                      size="xs"
                    >
                      {exportModels.isPending ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download {exportFormat.toUpperCase()}
                        </>
                      )}
                    </Button>
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
