import React, { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import { Search, X, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useProfileSearch, ProfileSearchResult } from "@/hooks/api/useSearch";
import { useDebounce } from "@/hooks/useDebounce";

interface ProfileSearchFilterProps {
  onVoterSelect?: (profile: ProfileSearchResult | null) => void;
  onModelSelect?: (profile: ProfileSearchResult | null) => void;
  selectedVoter?: ProfileSearchResult | null;
  selectedModel?: ProfileSearchResult | null;
  placeholder?: string;
  className?: string;
}

export function ProfileSearchFilter({
  onVoterSelect,
  onModelSelect,
  selectedVoter,
  selectedModel,
  placeholder = "Search profiles...",
  className,
}: ProfileSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // URL state for selected profile ids
  const [voterIdQuery, setVoterIdQuery] = useQueryState("voterId", { defaultValue: "" });
  const [modelIdQuery, setModelIdQuery] = useQueryState("modelId", { defaultValue: "" });

  // Debounce the search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: profiles, isLoading } = useProfileSearch(
    { query: debouncedSearchQuery, limit: 20 },
    isOpen // Always fetch when modal is open
  );

  // Custom token-based filter for the Command list
  // Supports queries like: "john", "@jane", "type:model", "role:voter", "is:model"
  const commandFilter = (value: string, search: string, keywords?: string[]) => {
    const normalizedHaystack = `${value} ${(keywords || []).join(" ")}`.toLowerCase();
    const tokens = search
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.replace(/^role:/, "type:").replace(/^is:/, "type:"));

    if (tokens.length === 0) return 1;

    const matchesAll = tokens.every((token) => {
      const mappedToken = token === "model" ? "type:model" : token === "voter" ? "type:voter" : token;
      return normalizedHaystack.includes(mappedToken);
    });

    return matchesAll ? 1 : -1;
  };

  const handleSelect = (profile: ProfileSearchResult, type: "voter" | "model") => {
    // Enforce single selection across voter/model by clearing the other selection
    if (type === "voter") {
      if (onModelSelect) onModelSelect(null);
      if (onVoterSelect) onVoterSelect(profile);
      // Update URL query params
      setModelIdQuery(null);
      setVoterIdQuery(profile.id);
    } else if (type === "model") {
      if (onVoterSelect) onVoterSelect(null);
      if (onModelSelect) onModelSelect(profile);
      // Update URL query params
      setVoterIdQuery(null);
      setModelIdQuery(profile.id);
    }
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClear = (type: "voter" | "model") => {
    if (type === "voter" && onVoterSelect) {
      onVoterSelect(null);
      setVoterIdQuery(null);
    } else if (type === "model" && onModelSelect) {
      onModelSelect(null);
      setModelIdQuery(null);
    }
  };

  const getRoleIcon = (userType: string) => {
    return userType === "MODEL" ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />;
  };

  const getRoleColor = (userType: string) => {
    return userType === "MODEL" ? "bg-purple-100 text-purple-800" : "bg-yellow-100 text-yellow-800";
  };

  const getRoleLabel = (userType: string) => {
    return userType === "MODEL" ? "Model" : "Voter";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Selected Filters Display */}
      {(selectedVoter || selectedModel) && (
        <div className="flex items-center gap-2">
          {selectedVoter && (
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
                <Users className="h-3 w-3" />
                {selectedVoter.user.name || selectedVoter.user.username}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleClear("voter")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {selectedModel && (
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800">
                <User className="h-3 w-3" />
                {selectedModel.user.name || selectedModel.user.username}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleClear("model")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Single Search Button */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSearchQuery("");
        }
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Search className="h-3 w-3 mr-1" />
            Search Profiles
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Profiles</DialogTitle>
            <DialogDescription>
              Search and select voters or models to filter votes
            </DialogDescription>
          </DialogHeader>
          <Command filter={commandFilter}>
            <CommandInput
              placeholder={placeholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-96">
              {isLoading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : !profiles || profiles.length === 0 ? (
                <CommandEmpty>
                  {searchQuery ? "No profiles found." : "Start typing to search profiles..."}
                </CommandEmpty>
              ) : (
                <>
                  {/* Voters Section */}
                  {onVoterSelect && (
                    <CommandGroup heading="Voters">
                      {profiles
                        .filter(profile => profile.user.type === "VOTER")
                        .map((profile) => (
                        <CommandItem
                          key={`voter-${profile.id}`}
                          value={`${profile.user.name || profile.user.username} @${profile.user.username ?? ""} type:voter`}
                          keywords={["voter", (profile.user.username ?? "").toLowerCase()]}
                          onSelect={() => handleSelect(profile, "voter")}
                          className="flex items-center gap-2"
                        >
                          {profile.user.image ? (
                            <img
                              src={profile.user.image}
                              alt={profile.user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{profile.user.name || profile.user.username}</p>
                            <p className="text-xs text-muted-foreground truncate">@{profile.user.username ?? ""}</p>
                          </div>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
                            <Users className="h-3 w-3 mr-1" />
                            Voter
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Models Section */}
                  {onModelSelect && (
                    <CommandGroup heading="Models">
                      {profiles
                        .filter(profile => profile.user.type === "MODEL")
                        .map((profile) => (
                        <CommandItem
                          key={`model-${profile.id}`}
                          value={`${profile.user.name || profile.user.username} @${profile.user.username ?? ""} type:model`}
                          keywords={["model", (profile.user.username ?? "").toLowerCase()]}
                          onSelect={() => handleSelect(profile, "model")}
                          className="flex items-center gap-2"
                        >
                          {profile.user.image ? (
                            <img
                              src={profile.user.image}
                              alt={profile.user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{profile.user.name || profile.user.username}</p>
                            <p className="text-xs text-muted-foreground truncate">@{profile.user.username ?? ""}</p>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800">
                            <User className="h-3 w-3 mr-1" />
                            Model
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
