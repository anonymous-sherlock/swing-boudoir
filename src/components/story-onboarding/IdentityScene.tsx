import identityImage from "@/assets/onboarding-identity.jpg";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, MapPin, Phone, User, User2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CountryDropdown } from "../ui/country-dropdown";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormData } from "./index";
import { PhoneInput } from "../ui/phone-input";

interface IdentitySceneProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  isTransitioning: boolean;
}

const FormSchema = z.object({
  dateOfBirth: z
    .string({
      required_error: "Date of birth is required",
    })
    .min(1, "Date of birth is required")
    .refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, "You must be 18 or older to register"),
  gender: z
    .string({
      required_error: "Gender selection is required",
    })
    .min(1, "Gender selection is required"),
  country: z
    .string({
      required_error: "Country is required",
    })
    .min(1, "Country selection is required"),
  city: z
    .string({
      required_error: "City is required",
    })
    .min(2, "City must be at least 2 characters"),
  address: z
    .string({
      required_error: "Address is required",
    })
    .min(5, "Address must be at least 5 characters"),
  zipcode: z
    .string({
      required_error: "Zipcode is required",
    })
    .min(3, "Zipcode must be at least 3 characters"),
  hobbiesAndPassions: z.string().max(300, "Hobbies and passions must be at most 300 characters").optional(),
  experienceLevel: z
    .string({
      required_error: "Experience level is required",
    })
    .min(1, "Experience level is required"),
  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .min(1, "Phone number is required"),
});

const IdentityScene: React.FC<IdentitySceneProps> = ({ formData, updateFormData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateOfBirth: formData.dateOfBirth || "",
      gender: formData.gender || "",
      country: formData.country || "",
      city: formData.city || "",
      address: formData.address || "",
      zipcode: formData.zipcode || "",
      hobbiesAndPassions: formData.hobbiesAndPassions || "",
      experienceLevel: formData.experienceLevel || "",
      phone: formData.phone || "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // Update form data with validated values
    updateFormData({
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      country: data.country,
      city: data.city,
      address: data.address,
      zipcode: data.zipcode,
      hobbiesAndPassions: data.hobbiesAndPassions,
      experienceLevel: data.experienceLevel,
      phone: data.phone,
    });

    toast.success("About information saved successfully!");
    onNext();
  }

  return (
    <div className="relative">
      <div
        className="scene-background"
        style={{
          backgroundImage: `url(${identityImage})`,
        }}
      />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/90" /> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="scene-content !pt-28">
            <div className="w-full p-0 md:max-w-2xl mx-auto animate-fade-in-up rounded-2xl !bg-black/30 !backdrop-blur-xl md:p-4">
              <div className="glass-card-dark">
                <div className="text-center mb-8">
                  <User className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                  <h2 className="section-title">Tell us about yourself</h2>
                  <p className="text-gray-300">Let's capture your essence</p>
                </div>

                {/* Experience Level Section */}
                <div className="form-grid-2">
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormLabel className="flex gap-2 items-center justify-start text-sm font-medium mb-2">
                          <User2 className="w-4 h-4" />
                          Experience Level
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full bg-black/50 border border-gray-800 text-white/80 placeholder:text-muted-foreground focus:ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (2-4 years)</SelectItem>
                              <SelectItem value="experienced">Experienced (5-9 years)</SelectItem>
                              <SelectItem value="professional">Professional (10+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormLabel className="flex gap-2 items-center justify-start text-sm font-medium mb-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <PhoneInput 
                          defaultCountry="US"
                          classNames={{
                            triggerStyle: "bg-black/50 border border-gray-800 text-white/80 placeholder:text-muted-foreground focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent focus-visible:outline-none",
                            inputStyle: "bg-black/50 border border-gray-800 text-white/80 placeholder:text-muted-foreground focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent focus-visible:outline-none"
                          }}
                          {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <div className="form-grid-2">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-2">
                          <FormLabel className="flex gap-2 items-center justify-start">
                            <CalendarIcon className="w-4 h-4" />
                            Date of Birth
                          </FormLabel>
                          <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"competition"}
                                  className={cn(
                                    "w-full font-normal bg-black/50 !mt-0 focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent focus-visible:outline-none border !border-gray-800",
                                    field.value ? "text-white/80" : "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? `${format(field.value, "PPP")}` : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                selected={date || (field.value ? new Date(field.value) : undefined)}
                                onSelect={(selectedDate) => {
                                  if (selectedDate) {
                                    setDate(selectedDate);
                                    field.onChange(selectedDate.toISOString().split("T")[0]);
                                    updateFormData({ dateOfBirth: selectedDate.toISOString().split("T")[0] });
                                  }
                                }}
                                onDayClick={() => setIsOpen(false)}
                                defaultMonth={field.value ? new Date(field.value) : undefined}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex gap-2 items-center justify-start mb-2">
                            <User className="w-4 h-4" />
                            Gender
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateFormData({ gender: value });
                            }}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={cn(
                                  "shadow-glow bg-black/50 hover:opacity-90 outline-none border border-gray-800 focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
                                  field.value ? "text-white/80" : "text-muted-foreground"
                                )}
                              >
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="form-grid-2">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel className="flex gap-2 items-center justify-start mb-2 ">
                            <MapPin className="w-4 h-4" />
                            Country
                          </FormLabel>
                          <FormControl>
                            <CountryDropdown
                              placeholder="Select country"
                              classNames={{
                                popupTrigger: cn(
                                  "w-full font-normal bg-black/50 !mt-0 focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent focus-visible:outline-none border-gray-800 shadow-glow",
                                  field.value ? "text-white/80" : "text-muted-foreground"
                                ),
                              }}
                              defaultValue={field.value}
                              onChange={(country) => {
                                field.onChange(country.alpha3);
                                updateFormData({ country: country.alpha3 });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex gap-2 items-center justify-start mb-2">
                            <MapPin className="w-4 h-4" />
                            City
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className={cn(
                                "shadow-glow bg-black/50 border border-gray-800 outline-none placeholder:text-muted-foreground focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
                                field.value ? "text-white/80" : "text-muted-foreground"
                              )}
                              placeholder="New York"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateFormData({ city: e.target.value });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="form-grid-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex gap-2 items-center justify-start mb-2">
                            <MapPin className="w-4 h-4" />
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className={cn(
                                "shadow-glow bg-black/50 border border-gray-800 outline-none placeholder:text-muted-foreground focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
                                field.value ? "text-white/80" : "text-muted-foreground"
                              )}
                              placeholder="123 Main Street"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateFormData({ address: e.target.value });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex gap-2 items-center justify-start mb-2">
                            <MapPin className="w-4 h-4" />
                            Zipcode
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className={cn(
                                "shadow-glow bg-black/50 border border-gray-800 outline-none placeholder:text-muted-foreground focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
                                field.value ? "text-white/80" : "text-muted-foreground"
                              )}
                              placeholder="10001"
                              {...field}
                              onChange={(e) => {
                                // Only allow numbers
                                const numericValue = e.target.value.replace(/\D/g, "");
                                field.onChange(numericValue);
                                updateFormData({ zipcode: numericValue });
                              }}
                              onKeyDown={(e) => {
                                // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                // if (
                                //   [8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                                //   // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                //   (e.keyCode === 65 && e.ctrlKey === true) ||
                                //   (e.keyCode === 67 && e.ctrlKey === true) ||
                                //   (e.keyCode === 86 && e.ctrlKey === true) ||
                                //   (e.keyCode === 88 && e.ctrlKey === true)
                                // ) {
                                //   return;
                                // }
                                // // Ensure that it is a number and stop the keypress if not
                                // if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                                //   e.preventDefault();
                                // }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Hobbies and Passions Section */}
                <FormField
                  control={form.control}
                  name="hobbiesAndPassions"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel className="flex gap-2 items-center justify-start text-sm font-medium mb-2">
                        <User2 className="w-4 h-4" />
                        Hobbies & Passions
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Tell us about your hobbies, interests, and what you're passionate about. What do you love to do in your free time?"
                            className="w-full resize-none h-24 bg-black/50 border border-gray-800 text-white/80 placeholder:text-gray-500 focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent outline-none"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updateFormData({ hobbiesAndPassions: e.target.value });
                            }}
                            maxLength={300}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">{field.value?.length || 0}/300</div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center mt-8">
                  <Button type="submit" className="btn-primary flash-effect group">
                    Continue Journey
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default IdentityScene;
