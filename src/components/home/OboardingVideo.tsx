import { Card, CardContent } from "@/components/ui/card";
import { Target, DollarSign, Link } from "lucide-react";

export default function OnboardingVideo() {
  return (
    <>
      {/* Video Section */}
      <div className="mt-20 bg-gradient-to-br from-muted/40 to-muted/20 rounded-3xl p-8 md:p-12 border border-muted/30 shadow-xl">
        <div className="text-center mb-10">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Watch our comprehensive guide to understand the complete process and discover how easy it is to participate in our competitions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30">
            <iframe
              src="https://www.youtube.com/embed/Mfg7-Bl5Gy8"
              title="How It Works - Competition Guide"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-background/80 rounded-full border border-muted/30">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <p className="text-sm text-muted-foreground font-medium">Learn the step-by-step process to maximize your chances of winning</p>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div className="min-h-screen bg-gray-50 px-6 py-16">
    //   <div className="max-w-7xl mx-auto">
    //     {/* Hero Section */}
    //     <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
    //       <div className="space-y-6">
    //         <p className="text-sm text-gray-600 font-medium">How to get started?</p>
    //         <h1 className="text-5xl font-bold text-gray-900 leading-tight">
    //           Join Our Platform
    //           <br />
    //           and Shine
    //         </h1>
    //         <p className="text-lg text-gray-600 leading-relaxed max-w-md">
    //           Our platform empowers models to showcase their talent in exciting competitions. Participate, gather votes from supporters, and compete for amazing prize money.
    //         </p>
    //       </div>

    //       {/* YouTube Video Embed */}
    //       <div className="flex justify-center lg:justify-end">
    //         <div className="relative w-full max-w-xl">
    //           <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
    //             <iframe
    //               width="100%"
    //               height="100%"
    //               src="https://www.youtube.com/embed/Mfg7-Bl5Gy8?si=wEgBjBxzo4OESPpk"
    //               title="Platform Onboarding Video"
    //               frameBorder="0"
    //               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //               allowFullScreen
    //               className="w-full h-full"
    //             ></iframe>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Feature Cards */}
    //     <div className="grid md:grid-cols-3 gap-8">
    //       <Card className="border-0 shadow-sm bg-white">
    //         <CardContent className="p-8">
    //           <div className="mb-6">
    //             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
    //               <Target className="w-6 h-6 text-gray-700" />
    //             </div>
    //           </div>
    //           <h3 className="text-xl font-semibold text-gray-900 mb-4">Showcase Your Talent</h3>
    //           <p className="text-gray-600 leading-relaxed">
    //             Join competitions, display your skills, and stand out. Our platform makes it easy to participate and shine in front of a global audience.
    //           </p>
    //         </CardContent>
    //       </Card>

    //       <Card className="border-0 shadow-sm bg-white">
    //         <CardContent className="p-8">
    //           <div className="mb-6">
    //             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
    //               <DollarSign className="w-6 h-6 text-gray-700" />
    //             </div>
    //           </div>
    //           <h3 className="text-xl font-semibold text-gray-900 mb-4">Win Prize Money</h3>
    //           <p className="text-gray-600 leading-relaxed">
    //             Compete to win exciting cash prizes. The more votes you gather from supporters, the closer you get to claiming the top prize.
    //           </p>
    //         </CardContent>
    //       </Card>

    //       <Card className="border-0 shadow-sm bg-white">
    //         <CardContent className="p-8">
    //           <div className="mb-6">
    //             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
    //               <Link className="w-6 h-6 text-gray-700" />
    //             </div>
    //           </div>
    //           <h3 className="text-xl font-semibold text-gray-900 mb-4">Engage with Voters</h3>
    //           <p className="text-gray-600 leading-relaxed">
    //             Connect with your audience and rally their support. Our platform simplifies gathering votes to boost your chances of winning.
    //           </p>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   </div>
    // </div>
  );
}
