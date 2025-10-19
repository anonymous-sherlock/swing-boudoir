import CompetitionCard from "@/components/competitions/CompetitionCard";
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle } from "@/components/global/modal";
import { useContests } from "@/hooks/api/useContests";
import { RefreshCw, Trophy } from "lucide-react";

export interface ContestEncouragementModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should be closed */
  onClose: () => void;
  onSuccess: () => void;
  /** Custom title for the modal */
  title?: string;
  /** Custom message for the modal */
  message?: string;
}

export function ContestEncouragementModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Oops! Looks like you haven't joined any contests yet",
  message = "Join exciting contests to showcase your skills, compete with others, and win amazing prizes!",
}: ContestEncouragementModalProps) {
  // Fetch active competitions to show in the modal
  const { data: contestsData, isLoading } = useContests(1, 6, "active");
  const competitions = contestsData?.data || [];

  const handleJoinContest = () => {
    onSuccess();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()} backdrop="blur">
      <ModalContent
        className="!max-w-6xl w-full gap-2"
        size="full"
        {...{
          onPointerDownOutside: (e: PointerEvent) => e.preventDefault(),
          onEscapeKeyDown: (e: KeyboardEvent) => e.preventDefault(),
        }}
      >
        <ModalHeader>
          <div className="flex items-center justify-start gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="">
              <ModalTitle className="text-left text-lg">{title}</ModalTitle>
              <ModalDescription className="text-left text-sm text-muted-foreground">{message}</ModalDescription>
            </div>
          </div>
        </ModalHeader>

        {/* Competitions List */}
        <div className="flex-1 overflow-hidden -mr-6">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading competitions...</span>
            </div>
          ) : competitions.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competitions.map((contest) => (
                  <div key={contest.id} className="scale-95">
                    <CompetitionCard contest={contest} showJoinButton={true} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No active competitions at the moment</p>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
