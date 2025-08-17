import { CheckCircle, AlertTriangle, FileText, Users, Camera, Award } from "lucide-react";

export const ruleCategories = [
    {
        icon: Users,
        title: "Eligibility Requirements",
        badge: "Essential",
        rules: [
            "Must be 18 years of age or older",
            "Legal resident of participating countries",
            "Not currently under exclusive modeling contract",
            "Able to travel internationally if selected",
            "No criminal background that would prevent travel",
        ],
    },
    {
        icon: Camera,
        title: "Submission Guidelines",
        badge: "Important",
        rules: [
            "Submit 3-5 high-resolution photos (minimum 300 DPI)",
            "Photos must be recent (within 6 months)",
            "No excessive retouching or filters",
            "Must own rights to all submitted photos",
            "Include variety of poses and outfits",
        ],
    },
    {
        icon: FileText,
        title: "Content Standards",
        badge: "Mandatory",
        rules: [
            "All content must be appropriate and tasteful",
            "No nudity or sexually explicit material",
            "Photos must comply with platform guidelines",
            "Respectful and professional presentation",
            "Original content only - no copyright infringement",
        ],
    },
    {
        icon: Award,
        title: "Competition Process",
        badge: "Process",
        rules: [
            "Judging combines expert panel and public voting",
            "Voting period varies by competition",
            "Winners announced within 2 weeks of voting close",
            "Decisions are final and binding",
            "One entry per person per competition",
        ],
    },
];

export const prohibitedActions = [
    "Creating multiple accounts or fake profiles",
    "Submitting photos that aren't of yourself",
    "Using bots or automated voting systems",
    "Harassment of other participants or judges",
    "Attempting to influence judges outside the platform",
    "Submitting inappropriate or offensive content",
];

export const prizeTerms = [
    "Cash prizes paid within 30 days of winner announcement",
    "Travel prizes must be claimed within 12 months",
    "Winners responsible for taxes on prize values",
    "Photo shoots and experiences non-transferable",
    "Maxim reserves right to substitute prizes of equal value",
];