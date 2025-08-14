"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Heart, Star, ArrowLeft, ArrowRight, CheckCircle, Users, Award, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const STEPS = ["Welcome", "Health Profile", "Measurements", "Coach Match", "Setup Complete"]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [onboardingData, setOnboardingData] = useState({
    condition: "",
    diagnosisTime: "",
    primaryGoal: "",
    weight: "",
    height: "",
    recentGlucose: "",
    glucoseType: "",
    coachingStyle: "",
    notifications: true,
    firstGoal: "",
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Save onboarding data to Supabase
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  const handleSkip = () => {
    handleNext()
  }

  // Step indicators
  const StepIndicator = () => (
    <div className="flex justify-center space-x-2 mb-8">
      {STEPS.map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all ${
            index === currentStep ? "bg-blue-600 w-4 h-4" : index < currentStep ? "bg-blue-600" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Step 1: Welcome & Value Proposition */}
        {currentStep === 0 && (
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MetaReverse</span>
            </div>

            <div className="space-y-6">
              <Image
                src="/happy-person-glucose-meter.png"
                alt="Happy person managing their health"
                width={300}
                height={200}
                className="mx-auto rounded-lg"
              />

              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Take control of your health journey</h1>
                <p className="text-xl text-gray-600 max-w-lg mx-auto">
                  Join thousands who've improved their diabetes and weight with personalized coaching
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="text-gray-700 ml-2">4.9/5 from 10,000+ users</span>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
                <div className="space-y-2">
                  <Users className="h-8 w-8 text-blue-600 mx-auto" />
                  <p className="text-sm text-gray-600">Expert coaches</p>
                </div>
                <div className="space-y-2">
                  <Award className="h-8 w-8 text-green-600 mx-auto" />
                  <p className="text-sm text-gray-600">Proven results</p>
                </div>
                <div className="space-y-2">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto" />
                  <p className="text-sm text-gray-600">24/7 support</p>
                </div>
              </div>

              <Button onClick={handleNext} size="lg" className="w-full max-w-sm mx-auto">
                Get Started Free
              </Button>

              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button onClick={() => router.push("/auth/login")} className="text-blue-600 hover:underline">
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Steps 2-5 with progress indicator */}
        {currentStep > 0 && (
          <>
            <StepIndicator />

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {currentStep === 1 && "Help us personalize your experience"}
                  {currentStep === 2 && "Let's establish your baseline"}
                  {currentStep === 3 && "Meet your personal health coach"}
                  {currentStep === 4 && "You're almost ready!"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "This helps us create the perfect plan for you"}
                  {currentStep === 2 && "Approximate numbers are perfectly fine"}
                  {currentStep === 3 && "We've matched you with a specialist"}
                  {currentStep === 4 && "Let's set you up for success"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 2: Quick Health Profile */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Primary Condition *</Label>
                      <RadioGroup
                        value={onboardingData.condition}
                        onValueChange={(value) => setOnboardingData((prev) => ({ ...prev, condition: value }))}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="type2_diabetes" id="type2" />
                          <Label htmlFor="type2" className="flex-1 cursor-pointer">
                            Type 2 Diabetes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="prediabetes" id="prediabetes" />
                          <Label htmlFor="prediabetes" className="flex-1 cursor-pointer">
                            Pre-diabetes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="weight_management" id="weight" />
                          <Label htmlFor="weight" className="flex-1 cursor-pointer">
                            Weight management
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="not_sure" id="not_sure" />
                          <Label htmlFor="not_sure" className="flex-1 cursor-pointer">
                            Not sure (we'll help you figure it out)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">How long ago were you diagnosed?</Label>
                      <RadioGroup
                        value={onboardingData.diagnosisTime}
                        onValueChange={(value) => setOnboardingData((prev) => ({ ...prev, diagnosisTime: value }))}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="recent" id="recent" />
                          <Label htmlFor="recent">Recently (less than 1 year)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1-5_years" id="1-5_years" />
                          <Label htmlFor="1-5_years">1-5 years ago</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5+_years" id="5+_years" />
                          <Label htmlFor="5+_years">5+ years ago</Label>
                        </div>
                      </RadioGroup>
                      <button onClick={handleSkip} className="text-sm text-blue-600 hover:underline">
                        Skip this question
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Current Goal *</Label>
                      <RadioGroup
                        value={onboardingData.primaryGoal}
                        onValueChange={(value) => setOnboardingData((prev) => ({ ...prev, primaryGoal: value }))}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="lower_blood_sugar" id="lower_sugar" />
                          <Label htmlFor="lower_sugar" className="flex-1 cursor-pointer">
                            Lower my blood sugar
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="lose_weight" id="lose_weight" />
                          <Label htmlFor="lose_weight" className="flex-1 cursor-pointer">
                            Lose weight sustainably
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="reduce_medications" id="reduce_meds" />
                          <Label htmlFor="reduce_meds" className="flex-1 cursor-pointer">
                            Reduce medications
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="more_energy" id="more_energy" />
                          <Label htmlFor="more_energy" className="flex-1 cursor-pointer">
                            Feel more energetic
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="get_healthier" id="get_healthier" />
                          <Label htmlFor="get_healthier" className="flex-1 cursor-pointer">
                            Get healthier overall
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* Step 3: Basic Measurements */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="weight" className="text-base font-medium">
                        Current Weight
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="weight"
                          type="number"
                          placeholder="180"
                          value={onboardingData.weight}
                          onChange={(e) => setOnboardingData((prev) => ({ ...prev, weight: e.target.value }))}
                          className="text-lg h-12"
                        />
                        <Button variant="outline" size="sm" className="px-4 bg-transparent">
                          lbs
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Approximate is fine</p>
                      <button onClick={handleSkip} className="text-sm text-blue-600 hover:underline">
                        I'll weigh myself later
                      </button>
                    </div>

                    {onboardingData.condition !== "weight_management" && (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Recent Glucose Reading</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="120"
                            value={onboardingData.recentGlucose}
                            onChange={(e) => setOnboardingData((prev) => ({ ...prev, recentGlucose: e.target.value }))}
                            className="text-lg h-12"
                          />
                          <Button variant="outline" size="sm" className="px-4 bg-transparent">
                            mg/dL
                          </Button>
                        </div>
                        <div className="flex space-x-2">
                          {["Fasting", "After meal", "Random"].map((type) => (
                            <Button
                              key={type}
                              variant={onboardingData.glucoseType === type ? "default" : "outline"}
                              size="sm"
                              onClick={() => setOnboardingData((prev) => ({ ...prev, glucoseType: type }))}
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                        <button onClick={handleSkip} className="text-sm text-blue-600 hover:underline">
                          I don't have a recent reading
                        </button>
                      </div>
                    )}

                    <div className="space-y-4">
                      <Label htmlFor="height" className="text-base font-medium">
                        Height
                      </Label>
                      <div className="flex space-x-2">
                        <Input id="height" type="number" placeholder="5" className="text-lg h-12" />
                        <span className="flex items-center text-gray-500">ft</span>
                        <Input type="number" placeholder="8" className="text-lg h-12" />
                        <span className="flex items-center text-gray-500">in</span>
                      </div>
                      <button onClick={handleSkip} className="text-sm text-blue-600 hover:underline">
                        Skip for now
                      </button>
                    </div>

                    {onboardingData.weight && onboardingData.height && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Great! Your BMI is calculated and ready for tracking.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Coach Matching */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
                        <Image
                          src="/coach-sarah-martinez.png"
                          alt="Dr. Sarah Martinez"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Dr. Sarah Martinez, RD</h3>
                        <p className="text-blue-600">Certified Diabetes Educator</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Perfect match!</strong> Specializes in{" "}
                          {onboardingData.condition === "type2_diabetes"
                            ? "Type 2 diabetes management"
                            : onboardingData.condition === "prediabetes"
                              ? "diabetes prevention"
                              : "sustainable weight management"}
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>200+ success stories</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-amber-500" />
                          <span>4.9/5 rating</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Coaching style preference:</Label>
                      <RadioGroup
                        value={onboardingData.coachingStyle}
                        onValueChange={(value) => setOnboardingData((prev) => ({ ...prev, coachingStyle: value }))}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="structured" id="structured" />
                          <Label htmlFor="structured">More structured and scheduled</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="flexible" id="flexible" />
                          <Label htmlFor="flexible">Flexible check-ins as needed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="surprise" id="surprise" />
                          <Label htmlFor="surprise">Surprise me - you choose!</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="text-center">
                      <button onClick={handleSkip} className="text-sm text-blue-600 hover:underline">
                        See other coaches
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5: Quick Setup & First Win */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications" className="text-base font-medium">
                          Gentle Health Reminders
                        </Label>
                        <Switch
                          id="notifications"
                          checked={onboardingData.notifications}
                          onCheckedChange={(checked) =>
                            setOnboardingData((prev) => ({ ...prev, notifications: checked }))
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Get gentle reminders for glucose checks and meals (you can adjust these anytime)
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">This week, I want to...</Label>
                      <RadioGroup
                        value={onboardingData.firstGoal}
                        onValueChange={(value) => setOnboardingData((prev) => ({ ...prev, firstGoal: value }))}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="log_glucose" id="log_glucose" />
                          <Label htmlFor="log_glucose" className="flex-1 cursor-pointer">
                            Log my glucose 3 times daily
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="daily_walk" id="daily_walk" />
                          <Label htmlFor="daily_walk" className="flex-1 cursor-pointer">
                            Take a 10-minute walk each day
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="eat_vegetables" id="eat_vegetables" />
                          <Label htmlFor="eat_vegetables" className="flex-1 cursor-pointer">
                            Eat vegetables with lunch and dinner
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="drink_water" id="drink_water" />
                          <Label htmlFor="drink_water" className="flex-1 cursor-pointer">
                            Drink 6 glasses of water daily
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">🎉 You're all set!</h3>
                      <p className="text-gray-600">Let's make this week amazing together.</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  )}

                  <div className="ml-auto">
                    {currentStep < STEPS.length - 1 ? (
                      <Button onClick={handleNext}>
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleComplete} disabled={isLoading} size="lg">
                        {isLoading ? "Setting up your journey..." : "Start My Journey"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Skip option for non-essential steps */}
                {currentStep > 1 && currentStep < 4 && (
                  <div className="text-center pt-2">
                    <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
                      I'll complete this later
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
