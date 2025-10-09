import React, { useState, useCallback } from "react";
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS, Step } from "react-joyride";
import { Trophy, Sparkles, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TOUR_STORAGE_KEY } from "@/hooks/useProductTour";

// Extended step type for custom navigation and delay handling
interface ExtendedStep extends Step {
  stepType?: "navigation" | "action" | "celebration" | "wait";
  navigationDelay?: number;
  actionDelay?: number;
  waitForTarget?: boolean;
  listenForClick?: boolean;
  clickTarget?: string;
  clickSpotlightOnNextStep?: boolean;
  waitDelay?: number; // Generic delay before showing step (useful for waiting for animations, sidebar expansion, etc.)
  closeSidebarOnNext?: boolean; // Close sidebar when clicking Next or spotlight
}

interface JoyrideTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}


export const CompetitionsTour: React.FC<JoyrideTourProps> = ({ isOpen, onClose, onComplete }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Check if sidebar is already expanded
  const isSidebarExpanded = useCallback(() => {
    const sidebarContainer = document.querySelector('[data-tour="sidebar-container"]') as HTMLElement;
    return sidebarContainer && sidebarContainer.classList.contains("w-64");
  }, []);

  // Check if mobile sidebar is already open
  const isMobileSidebarOpen = useCallback(() => {
    const mobileSidebar = document.querySelector('[data-tour="mobile-sidebar-container"]') as HTMLElement;
    return mobileSidebar && mobileSidebar.classList.contains("translate-x-0");
  }, []);

  // Check if a target element exists and is visible
  const isTargetVisible = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
  }, []);

  // Wait for a target element to appear
  const waitForTarget = useCallback(
    (selector: string, maxAttempts = 50, interval = 100): Promise<boolean> => {
      return new Promise((resolve) => {
        let attempts = 0;
        const checkTarget = () => {
          attempts++;
          const element = document.querySelector(selector);
          if (element && isTargetVisible(selector)) {
            resolve(true);
          } else if (attempts >= maxAttempts) {
            console.warn(`Target ${selector} not found after ${maxAttempts} attempts`);
            resolve(false);
          } else {
            setTimeout(checkTarget, interval);
          }
        };
        checkTarget();
      });
    },
    [isTargetVisible]
  );

  // Get step indices based on the actual steps array
  const getStepIndices = useCallback((currentSteps: Step[]) => {
    const indices: Record<string, number> = {};

    currentSteps.forEach((step, index) => {
      const target = step.target as string;

      // Map step indices based on target selectors
      if (target === '[data-tour="mobile-hamburger-menu"]') {
        indices.mobileHamburger = index;
      } else if (target === '[data-tour="sidebar-toggle"]') {
        indices.expandSidebar = index;
      } else if (target === '[data-tour="sidebar-container"]' || target === '[data-tour="mobile-sidebar-container"]') {
        indices.sidebarNavigation = index;
      } else if (target === '[data-tour="competitions"]' || target === '[data-tour="mobile-sidebar-container"] [data-tour="competitions"]') {
        indices.competitions = index;
      } else if (target === '[data-tour="first-competition-card"]') {
        indices.joinContest = index;
      } else if (target === '[data-tour="join-contest-button"]') {
        indices.joinContestButton = index;
      } else if (target === '[data-tour="image-uploader-dialog"]') {
        indices.imageUploader = index;
      } else if (target === '[data-tour="join-contest-dialog-button"]') {
        indices.joinContestDialog = index;
      } else if (target === "body" && "stepType" in step && step.stepType === "celebration") {
        indices.celebration = index;
      } else if (target === '[data-tour="share-profile-button"]') {
        indices.shareProfile = index;
      }
    });

    return indices;
  }, []);

  // Common welcome step
  const welcomeStep: Step = React.useMemo(
    () => ({
      target: "body",
      content: (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Welcome to Your Modeling Platform</h2>
          <p className="text-gray-600">
            Congratulations on completing your profile setup. This guided tour will help you navigate the platform and understand how to participate in competitions and build your
            modeling career.
          </p>
        </div>
      ),
      placement: "center" as const,
      disableBeacon: true,
      showSkipButton: true,
      hideCloseButton: true,
    }),
    []
  );

  // Common celebration step
  const celebrationStep: Step & { stepType?: string } = React.useMemo(
    () => ({
      target: "body",
      content: (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Woohoo! You've Joined Your First Competition!</h2>
          <p className="text-gray-600 mb-4">
            Congratulations! You have successfully joined the competition. Your profile is now live and eligible to receive votes from the community.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 font-medium">Next Steps: Share your profile, engage with voters, and track your progress on the leaderboard.</p>
          </div>
        </div>
      ),
      placement: "center" as const,
      disableBeacon: true,
      hideFooter: false,
      stepType: "celebration" as const,
    }),
    []
  );

  // Common completion step
  const completionStep: Step = React.useMemo(
    () => ({
      target: "body",
      content: (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-900">You're All Set! ✨</h2>
          <p className="text-gray-600">
            Your profile is now live and fully configured. You can participate in competitions, receive votes from the community, and track your progress on the leaderboard. Best
            of luck with your modeling career.
          </p>
        </div>
      ),
      placement: "center" as const,
      disableBeacon: true,
      hideBackButton: true,
    }),
    []
  );

  // Mobile-specific steps
  const mobileSteps: ExtendedStep[] = React.useMemo(
    () => [
      welcomeStep,
      {
        target: '[data-tour="mobile-hamburger-menu"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Open Menu</h3>
            </div>
            <p className="text-gray-600">
              On mobile devices, tap this menu button to access your dashboard navigation. This will open the sidebar with all available platform options.
            </p>
          </div>
        ),
        placement: "bottom" as const,
        disableBeacon: true,
        hideFooter: false,
        hideCloseButton: true,
        spotlightClicks: true,
        clickSpotlightOnNextStep: true,
        actionDelay: 500,
        clickTarget: '[data-tour="mobile-hamburger-menu"]',
      },
      {
        target: '[data-tour="mobile-sidebar-container"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Sidebar Navigation</h3>
            </div>
            <p className="text-gray-600">
              The sidebar is now open with all navigation options. Use these buttons to navigate between different sections of your dashboard and access platform features.
            </p>
          </div>
        ),
        placement: "right" as const,
        disableBeacon: true,
        hideFooter: false,
        styles: {
         
          tooltip: {
            maxWidth: 320,
            zIndex: 1000,
            position: "fixed",
            top: "-100px",
            left: "-230px",
          },
          tooltipContent: {},
          tooltipContainer: {
            textAlign: "left" as const,
          },
          spotlight: {
            zIndex: 999,
          },
        },
      },
      {
        target: '[data-tour="mobile-sidebar-container"] [data-tour="competitions"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Browse Competitions</h3>
            </div>
            <p className="text-gray-600">
              Tap "Competitions" in the sidebar to browse and join modeling competitions. This section allows you to showcase your talent and participate in contests with prize
              opportunities.
            </p>
          </div>
        ),
        placement: "right" as const,
        disableBeacon: true,
        hideFooter: false,
        navigationDelay: 1000,
        styles: {
          tooltip: {
            maxWidth: 350,
            zIndex: 1000,
          },
          tooltipContainer: {
            textAlign: "left" as const,
          },
        },
      },
      {
        target: '[data-tour="first-competition-card"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Active Competition</h3>
            </div>
            <p className="text-gray-600">
              This is an active competition available for participation. Click "Join Contest" to enter and showcase your talent. You can also view competition details to learn more
              about requirements and prizes.
            </p>
          </div>
        ),
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
        stepType: "wait" as const,
        waitForTarget: true,
      },
      {
        target: '[data-tour="join-contest-button"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Join Competition</h3>
            </div>
            <p className="text-gray-600">
              Click "Join Contest" to participate in this competition. Once you join, you will be eligible to receive votes from the community and compete for the prize pool.
            </p>
          </div>
        ),
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
        stepType: "action" as const,
        listenForClick: true,
        clickTarget: '[data-tour="join-contest-button"] button',
        actionDelay: 500,
      },
      {
        target: '[data-tour="image-uploader-dialog"]',
        content: "Upload your image for the competition.",
        placement: "bottom" as const,
        disableBeacon: true,
        hideFooter: true,
        hideCloseButton: true,
        disableOverlayClose: false,
        disableCloseOnEsc: false,
        styles: {
          overlay: {
            zIndex: 199,
          },
          overlayLegacy: {
            zIndex: 199,
          },
        },
      },
      {
        target: '[data-tour="join-contest-dialog-button"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Complete Your Entry</h3>
            </div>
            <p className="text-gray-600">
              Now click "Join Contest" to complete your competition entry. Your uploaded image will be displayed on your contest profile for community voting.
            </p>
          </div>
        ),
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
        spotlightClicks: true,
        disableOverlayClose: true,
        disableCloseOnEsc: true,
        styles: {
          overlay: {
            zIndex: 199,
          },
          overlayLegacy: {
            zIndex: 199,
          },
        },
      },
      celebrationStep,
      {
        target: '[data-tour="share-profile-button"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Share Your Profile</h3>
            </div>
            <p className="text-gray-600">
              Now that you have joined the competition, share your profile with friends and family to increase your vote count. The more people who view your profile, the better
              your chances of success.
            </p>
          </div>
        ),
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
      },
      completionStep,
    ],
    [welcomeStep, celebrationStep, completionStep]
  );

  // Desktop-specific steps
  const desktopSteps: ExtendedStep[] = React.useMemo(
    () => [
      welcomeStep,
      {
        target: '[data-tour="sidebar-toggle"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Expand Sidebar</h3>
            </div>
            <p className="text-gray-600">
              Click this button to expand the sidebar and view all navigation options. You can also click it again to collapse the sidebar and save screen space.
            </p>
          </div>
        ),
        placement: "right" as const,
        disableBeacon: true,
        hideFooter: false,
        spotlightClicks: true,
        stepType: "action" as const,
        actionDelay: 0,
        listenForClick: true,
        clickTarget: '[data-tour="sidebar-toggle"]',
      },
      {
        target: '[data-tour="sidebar-container"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Sidebar Navigation</h3>
            </div>
            <p className="text-gray-600">
              Here are all the navigation options in the sidebar. Use these buttons to navigate between different sections of your dashboard and access platform features.
            </p>
          </div>
        ),
        placement: "right" as const,
        disableBeacon: true,
        hideFooter: false,
        stepType: "wait" as const,
        waitForTarget: false,
        waitDelay: 0,
      },
      {
        target: '[data-tour="competitions"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Browse Competitions</h3>
            </div>
            <p className="text-gray-600">
              Click here to browse and join modeling competitions. This section allows you to showcase your talent and participate in contests with prize opportunities.
            </p>
          </div>
        ),
        placement: "right" as const,
        disableBeacon: true,
        hideFooter: false,
        stepType: "navigation" as const,
        navigationDelay: 1000,
        offset: 10,
        styles: {
          tooltip: {
            maxWidth: 350,
            zIndex: 1000,
          },
          tooltipContainer: {
            textAlign: "left" as const,
          },
        },
      },
      {
        target: '[data-tour="first-competition-card"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Active Competition</h3>
            </div>
            <p className="text-gray-600">
              This is an active competition available for participation. Click "Join Contest" to enter and showcase your talent. You can also view competition details to learn more
              about requirements and prizes.
            </p>
          </div>
        ),
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
        stepType: "wait" as const,
        waitForTarget: true,
      },
      {
        target: '[data-tour="join-contest-button"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Join Competition</h3>
            </div>
            <p className="text-gray-600">
              Click "Join Contest" to participate in this competition. Once you join, you will be eligible to receive votes from the community and compete for the prize pool.
            </p>
          </div>
        ),
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
        stepType: "action" as const,
        listenForClick: true,
        clickTarget: '[data-tour="join-contest-button"] button',
        actionDelay: 500,
      },
      {
        target: '[data-tour="image-uploader-dialog"]',
        content: "Upload your image for the competition.",
        placement: "bottom" as const,
        disableBeacon: true,
        hideFooter: true,
        hideCloseButton: true,
        disableOverlayClose: false,
        disableCloseOnEsc: false,
        styles: {
          overlay: {
            zIndex: 199,
          },
          overlayLegacy: {
            zIndex: 199,
          },
        },
      },
      {
        target: '[data-tour="join-contest-dialog-button"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Complete Your Entry</h3>
            </div>
            <p className="text-gray-600">
              Now click "Join Contest" to complete your competition entry. Your uploaded image will be displayed on your contest profile for community voting.
            </p>
          </div>
        ),
        clickTarget: '[data-tour="join-contest-dialog-button"]',
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
        spotlightClicks: true,
        disableOverlayClose: true,
        disableCloseOnEsc: true,
        styles: {
          tooltip: {
            pointerEvents: "auto",
            zIndex: 1000,
          },
          overlay: {
            zIndex: 199,
            pointerEvents: "none",
          },
          overlayLegacy: {
            zIndex: 199,
            pointerEvents: "none",
          },
        },
      },
      celebrationStep,
      {
        target: '[data-tour="share-profile-button"]',
        content: (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Share Your Profile</h3>
            </div>
            <p className="text-gray-600">
              Now that you have joined the competition, share your profile with friends and family to increase your vote count. The more people who view your profile, the better
              your chances of success.
            </p>
          </div>
        ),
        placement: "top" as const,
        disableBeacon: true,
        hideFooter: false,
      },
      completionStep,
    ],
    [welcomeStep, celebrationStep, completionStep]
  );

  // Get the appropriate steps based on device type
  const getValidSteps = useCallback(() => {
    const steps = isMobile ? mobileSteps : desktopSteps;

    // For mobile, always include all steps
    if (isMobile) {
      return steps;
    } else {
      // For desktop, conditionally include sidebar toggle step but maintain consistent indices
      return steps.filter((step) => {
        if (step.target === "body") return true; // Always include body steps

        // Always include all other steps to maintain consistent indices
        return true;
      });
    }
  }, [isMobile, mobileSteps, desktopSteps]);

  const steps = getValidSteps();

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, type, action, index } = data;
      const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

      if (finishedStatuses.includes(status)) {
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
        setRun(false);
        setStepIndex(0);
        onComplete();
      } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        const stepIndices = getStepIndices(steps);

        console.log("Step indices in callback:", stepIndices);

        // Handle TARGET_NOT_FOUND by skipping to next step
        if (type === EVENTS.TARGET_NOT_FOUND) {
          console.warn(`Target not found for step ${index}, skipping to next step`);
          setStepIndex(nextStepIndex);
          return;
        }

        // Log all events to debug
        if (type === EVENTS.STEP_AFTER) {
          console.log(`STEP_AFTER: index ${index}, action ${action}, target: ${steps[index]?.target}`);
        }

        // Handle special step actions
        if (index === stepIndices.mobileHamburger && action === ACTIONS.NEXT) {
          const currentStep = steps[index] as ExtendedStep;
          const targetElement = document.querySelector(currentStep.clickTarget || (currentStep.target as string)) as HTMLElement;
          targetElement?.click();
          const delay = currentStep.actionDelay || 300;
          setTimeout(() => setStepIndex(nextStepIndex), delay);
        } else if (index === stepIndices.expandSidebar && action === ACTIONS.NEXT) {
          // Wait for sidebar to fully expand before advancing
          const currentStep = steps[index] as ExtendedStep;
          const delay = currentStep.actionDelay || 800;
          setTimeout(() => setStepIndex(nextStepIndex), delay);
        } else if (index === stepIndices.sidebarNavigation && action === ACTIONS.NEXT) {
          // Handle sidebar navigation step with wait delay
          const currentStep = steps[index] as ExtendedStep;
          const delay = currentStep.waitDelay || 800;
          const target = currentStep.target as string;
          const targetElement = document.querySelector(target);
          console.log(`Sidebar navigation step: waiting ${delay}ms before advancing, target exists: ${!!targetElement}, target visible: ${isTargetVisible(target)}`);
          setTimeout(() => setStepIndex(nextStepIndex), delay);
        } else if (index === stepIndices.competitions && action === ACTIONS.NEXT) {
          // Click on competitions button for both mobile and desktop
          const competitionsButton = isMobile
            ? (document.querySelector('[data-tour="mobile-sidebar-container"] [data-tour="competitions"]') as HTMLElement)
            : (document.querySelector('[data-tour="competitions"]') as HTMLElement);

          if (competitionsButton) {
            competitionsButton.click();
            // Wait for navigation to complete before advancing
            const currentStep = steps[index] as ExtendedStep;
            const delay = currentStep.navigationDelay || 1000;
            setTimeout(() => setStepIndex(nextStepIndex), delay);
          } else {
            setStepIndex(nextStepIndex);
          }
        } else if (index === stepIndices.joinContestButton && action === ACTIONS.NEXT) {
          // When clicking Next in tour, automatically click the join contest button
          const currentStep = steps[index] as ExtendedStep;
          const targetSelector = currentStep.clickTarget || (currentStep.target as string);
          console.log('STEP_AFTER - Join contest button step - looking for button:', targetSelector);
          const joinButton = document.querySelector(targetSelector) as HTMLElement;
          console.log('STEP_AFTER - Join contest button found:', !!joinButton);
          if (joinButton) {
            console.log('STEP_AFTER - Clicking join contest button');
            // Click the button and then advance to next step
            joinButton.click();
            // Wait a bit for the modal to open, then advance
            setTimeout(() => setStepIndex(nextStepIndex), 500);
          } else {
            setStepIndex(nextStepIndex);
          }
        } else if (index === stepIndices.joinContestDialog && action === ACTIONS.NEXT) {
          // When clicking Next in tour, automatically click the join contest dialog button
          const currentStep = steps[index] as ExtendedStep;
          const targetSelector = currentStep.clickTarget || (currentStep.target as string);
          console.log('STEP_AFTER - Join contest dialog button step - looking for button:', targetSelector);
          const joinDialogButton = document.querySelector(targetSelector) as HTMLElement;
          console.log('STEP_AFTER - Join contest dialog button found:', !!joinDialogButton);
          if (joinDialogButton) {
            console.log('STEP_AFTER - Clicking join contest dialog button');
            // Click the button and then advance to next step
            joinDialogButton.click();
            // Wait a bit for the action to complete, then advance
            setTimeout(() => setStepIndex(nextStepIndex), 500);
          } else {
            setStepIndex(nextStepIndex);
          }
        } else {
          setStepIndex(nextStepIndex);
        }
      }
    },
    [onComplete, getStepIndices, steps, isTargetVisible, isMobile]
  );

  // Main tour control effect
  React.useEffect(() => {
    if (isOpen) {
      setRun(true);
      setStepIndex(0);
      // Initialize sidebar state
      setMobileSidebarOpen(isMobileSidebarOpen());
    } else {
      setRun(false);
    }
  }, [isOpen, isMobileSidebarOpen]);

  // Step-specific logic effect
  React.useEffect(() => {
    if (!run) return;

    const stepIndices = getStepIndices(steps);
    let cleanup: (() => void) | undefined;

    // Handle wait steps - wait for target to appear before showing step
    const currentStep = steps[stepIndex] as ExtendedStep;
    if (currentStep?.stepType === "wait") {
      const target = currentStep.target as string;

      // Apply waitDelay if specified
      const delay = currentStep.waitDelay || 0;

      if (currentStep.waitForTarget) {
        setTimeout(() => {
          waitForTarget(target).then((found) => {
            if (!found) {
              // If target not found, skip to next step
              console.warn(`Target ${target} not found for wait step, skipping to next step`);
              setStepIndex(stepIndex + 1);
            } else {
              console.log(`Target ${target} found for wait step, continuing`);
            }
          });
        }, delay);
      } else if (delay > 0) {
        // Just apply delay without waiting for target
        console.log(`Applying waitDelay of ${delay}ms for step ${stepIndex}`);
        // Don't automatically advance - let the callback handle it
      }
    }

    // Handle click listener steps
    if (currentStep?.listenForClick) {
      const targetSelector = currentStep.clickTarget || (currentStep.target as string);

      const handleClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const clickedElement = target.closest(targetSelector);

        if (clickedElement) {
          // Click detected on target element, wait for action delay then advance
          const delay = currentStep.actionDelay || 500;
          setTimeout(() => {
            setStepIndex(stepIndex + 1);
          }, delay);
        }
      };

      // Add event listener with bubbling
      document.addEventListener("click", handleClick, true);
      cleanup = () => document.removeEventListener("click", handleClick, true);
    }

    // Image uploader step - wait for target and check for image upload
    if (stepIndices.imageUploader !== undefined && stepIndex === stepIndices.imageUploader) {
      const waitForImageDialog = () => {
        const target = document.querySelector('[data-tour="image-uploader-dialog"]');
        if (!target) {
          setTimeout(waitForImageDialog, 100);
        }
      };
      waitForImageDialog();

      const checkForImageUpload = () => {
        const imagePreview = document.querySelector('[data-tour="image-uploader"] img');
        if (imagePreview && stepIndices.joinContestDialog !== undefined) {
          setTimeout(() => setStepIndex(stepIndices.joinContestDialog), 500);
        } else {
          setTimeout(checkForImageUpload, 200);
        }
      };
      setTimeout(checkForImageUpload, 1000);
    }

    // Join contest dialog step - listen for button click
    if (stepIndices.joinContestDialog !== undefined && stepIndex === stepIndices.joinContestDialog) {
      const handleJoinContestClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const joinButton = target.closest('[data-tour="join-contest-dialog-button"]');
        if (joinButton && stepIndices.celebration !== undefined) {
          setTimeout(() => setStepIndex(stepIndices.celebration), 1000);
        }
      };
      document.addEventListener("click", handleJoinContestClick, true);
      cleanup = () => document.removeEventListener("click", handleJoinContestClick, true);
    }

    // Mobile hamburger menu step - listen for click
    if (stepIndices.mobileHamburger !== undefined && stepIndex === stepIndices.mobileHamburger) {
      const handleMobileHamburgerClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const hamburgerButton = target.closest('[data-tour="mobile-hamburger-menu"]');
        if (hamburgerButton) {
          // Wait for sidebar to open, then advance to next step
          setTimeout(() => {
            const sidebar = document.querySelector('[data-tour="mobile-sidebar-container"]');
            if (sidebar && sidebar.classList.contains("translate-x-0")) {
              setStepIndex(stepIndex + 1);
            } else {
              // If sidebar didn't open, try again
              setTimeout(() => setStepIndex(stepIndex + 1), 300);
            }
          }, 600);
        }
      };
      document.addEventListener("click", handleMobileHamburgerClick, true);
      cleanup = () => document.removeEventListener("click", handleMobileHamburgerClick, true);
    }

    // Sidebar toggle step - listen for click
    if (stepIndices.expandSidebar !== undefined && stepIndex === stepIndices.expandSidebar) {
      const handleSidebarToggleClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const sidebarToggle = target.closest('[data-tour="sidebar-toggle"]');
        if (sidebarToggle) {
          setTimeout(() => setStepIndex(stepIndex + 1), 300);
        }
      };
      document.addEventListener("click", handleSidebarToggleClick, true);
      cleanup = () => document.removeEventListener("click", handleSidebarToggleClick, true);
    }

    // Hover state for competitions step
    if (stepIndices.competitions !== undefined && stepIndex === stepIndices.competitions) {
      // Use the actual target from the current step
      const currentStep = steps[stepIndex];
      const targetSelector = currentStep?.target as string;

      console.log("targetSelector", targetSelector);

      if (targetSelector) {
        const targetElement = document.querySelector(targetSelector) as HTMLElement;
        if (targetElement) {
          targetElement.style.backgroundColor = "hsl(var(--accent))";
          targetElement.style.color = "hsl(var(--accent-foreground))";
          targetElement.style.transition = "all 0.2s ease-in-out";
          targetElement.classList.add("tour-highlighted");
        }

        cleanup = () => {
          const element = document.querySelector(targetSelector) as HTMLElement;
          if (element) {
            element.style.backgroundColor = "";
            element.style.color = "";
            element.style.transition = "";
            element.classList.remove("tour-highlighted");
          }
        };
      }
    }

    return cleanup;
  }, [run, stepIndex, getStepIndices, steps, waitForTarget]);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      callback={handleJoyrideCallback}
      spotlightClicks
      disableOverlayClose
      disableScrolling={false}
      disableScrollParentFix={false}
      styles={{
        options: {
          primaryColor: "#3b82f6",
          textColor: "#374151",
          backgroundColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.8)",
          spotlightShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
          zIndex: 199,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
          fontSize: 16,
          maxWidth: 400,
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: "left" as const,
        },
        tooltipTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 8,
        },
        tooltipContent: {
          padding: "8px 0",
        },
        buttonNext: {
          backgroundColor: "#3b82f6",
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 14,
          fontWeight: "600",
        },
        buttonBack: {
          color: "#6b7280",
          marginRight: 8,
          fontSize: 14,
        },
        buttonClose: {
          color: "#6b7280",
          fontSize: 14,
        },
        spotlight: {
          borderRadius: 8,
        },
      }}
      locale={{
        back: "Previous",
        close: "Close",
        last: "Finish",
        next: "Next",
      }}
    />
  );
};
