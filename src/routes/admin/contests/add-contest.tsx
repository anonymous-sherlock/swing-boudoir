import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel as ShadFormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCreateContest, useUploadContestImages } from '@/hooks/api/useContests'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Calendar,
  FileText,
  Image,
  Plus,
  Settings,
  Target,
  Trash2,
  Trophy,
  Upload,
  X
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/admin/contests/add-contest')({
  component: () => <AddContestPage />,
})

interface ContestFormData {
  name: string
  description: string
  startDate: string
  endDate: string
  prizePool: number
  maxParticipants: number
  isActive: boolean
  isPublic: boolean
  allowVoting: boolean
  awards: Array<{
    name: string
    description: string
    icon: string
    prize: number
    position: number
  }>
  tags: string[]
  galleryImages: File[]
}

const defaultAward = {
  name: '',
  description: '',
  icon: '🏆',
  prize: 0,
  position: 1
}


// Zod schema (core required fields)
const contestSchema = z.object({
  name: z.string().min(1, 'Contest name is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  prizePool: z.coerce.number().positive('Prize pool must be greater than 0'),
})

type ContestSchema = z.infer<typeof contestSchema>

function AddContestPage() {
  const navigate = useNavigate()
  const createContest = useCreateContest()
  const uploadContestImages = useUploadContestImages()
  
  const [formData, setFormData] = useState<ContestFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    prizePool: 0,
    maxParticipants: 100,
    isActive: true,
    isPublic: true,
    allowVoting: true,
    awards: [defaultAward],
    tags: [],
    galleryImages: []
  })

  const [newTag, setNewTag] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // react-hook-form
  const form = useForm<ContestSchema>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      prizePool: formData.prizePool,
    },
    mode: 'onSubmit',
  })

  const handleInputChange = (field: keyof ContestFormData, value: ContestFormData[keyof ContestFormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAwardChange = (index: number, field: keyof typeof defaultAward, value: string | number) => {
    const newAwards = [...formData.awards]
    newAwards[index] = { ...newAwards[index], [field]: value }
    setFormData(prev => ({ ...prev, awards: newAwards }))
  }

  const addAward = () => {
    const newPosition = Math.max(...formData.awards.map(a => a.position)) + 1
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { ...defaultAward, position: newPosition }]
    }))
  }

  const removeAward = (index: number) => {
    if (formData.awards.length > 1) {
      const newAwards = formData.awards.filter((_, i) => i !== index)
      // Reorder positions
      newAwards.forEach((award, i) => {
        award.position = i + 1
      })
      setFormData(prev => ({ ...prev, awards: newAwards }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }


  // Image upload handlers
  const handleGalleryImageUpload = (files: File[]) => {
    const validImages = files.filter(file => file.type.startsWith('image/'))
    if (validImages.length !== files.length) {
      toast.error('Some files were not valid images')
    }
    setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...validImages] }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleGalleryImageUpload(Array.from(e.dataTransfer.files))
    }
  }, [])

  const onSubmit = async (values: ContestSchema) => {
    try {
      // Create contest with JSON payload
      const payload = {
        name: values.name,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        prizePool: values.prizePool,
        awards: formData.awards.map(a => ({ name: a.name, icon: a.icon })),
      }

      const created = await createContest.mutateAsync(payload)

      // Upload images if provided
      const files: File[] = []
      if (formData.galleryImages.length) files.push(...formData.galleryImages)
      if (files.length) {
        await uploadContestImages.mutateAsync({ id: created.id, files })
      }

      toast.success('Contest created successfully!')
      navigate({ to: '/admin/contests' })
    } catch (error) {
      console.error('Failed to create contest:', error)
      toast.error('Failed to create contest. Please try again.')
    }
  }

  const totalPrizePool = formData.awards.reduce((sum, award) => sum + award.prize, 0)
  const remainingPrize = formData.prizePool - totalPrizePool

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create New Contest</h1>
        <p className="text-sm text-muted-foreground">
          Set up a new contest with all the details, awards, and images.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-3 space-y-4">
              {/* Basic Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <ShadFormLabel className="text-sm">Contest Name *</ShadFormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                handleInputChange('name', e.target.value)
                              }}
                              placeholder="Enter contest name"
                              className="h-9 text-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants" className="text-sm">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                        min="1"
                        placeholder="100"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <ShadFormLabel className="text-sm">Description *</ShadFormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              handleInputChange('description', e.target.value)
                            }}
                            placeholder="Describe your contest..."
                            rows={3}
                            className="text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              {/* Images Upload */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Contest Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Gallery Images */}
                  <div className="space-y-2">
                    <Label className="text-sm">Gallery Images</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                      onDragEnter={onDrag}
                      onDragLeave={onDrag}
                      onDragOver={onDrag}
                      onDrop={onDrop}
                    >
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <Image className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium">
                            Drop gallery images here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.multiple = true
                              input.onchange = (e) => {
                                const files = Array.from((e.target as HTMLInputElement).files || [])
                                if (files.length > 0) handleGalleryImageUpload(files as File[])
                              }
                              input.click()
                            }}
                            className="h-7 text-xs"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Choose Files
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Images Preview */}
                    {formData.galleryImages.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Selected Images ({formData.galleryImages.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {formData.galleryImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                onClick={() => removeGalleryImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {image.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Dates & Timing */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Dates & Timing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        {...form.register('startDate')}
                      />
                      {form.formState.errors.startDate && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.startDate.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        {...form.register('endDate')}
                      />
                      {form.formState.errors.endDate && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prize Pool & Awards */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Prize Pool & Awards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <FormField
                    control={form.control}
                    name="prizePool"
                    render={({ field }) => (
                      <FormItem>
                        <ShadFormLabel className="text-sm">Total Prize Pool ($) *</ShadFormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              handleInputChange('prizePool', parseFloat(e.target.value))
                            }}
                            min="0"
                            step="0.01"
                            placeholder="10000"
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Awards</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addAward} className="h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Add Award
                      </Button>
                    </div>
                    
                    {formData.awards.map((award, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Award #{award.position}</span>
                          {formData.awards.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAward(index)}
                              className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Name *</Label>
                            <Input
                              value={award.name}
                              onChange={(e) => handleAwardChange(index, 'name', e.target.value)}
                              placeholder="1st Place"
                              className="h-8 text-xs"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs">Icon</Label>
                            <Input
                              value={award.icon}
                              onChange={(e) => handleAwardChange(index, 'icon', e.target.value)}
                              placeholder="🏆"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={award.description}
                            onChange={(e) => handleAwardChange(index, 'description', e.target.value)}
                            placeholder="Award description..."
                            className="h-8 text-xs"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Prize Amount ($)</Label>
                          <Input
                            type="number"
                            value={award.prize}
                            onChange={(e) => handleAwardChange(index, 'prize', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="5000"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-xs font-medium">Prize Pool Distribution:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Total: ${totalPrizePool.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">/</span>
                        <span className="text-xs">${formData.prizePool.toLocaleString()}</span>
                        {remainingPrize !== 0 && (
                          <Badge variant={remainingPrize > 0 ? "secondary" : "destructive"} className="text-xs">
                            {remainingPrize > 0 ? `+$${remainingPrize.toLocaleString()}` : `-$${Math.abs(remainingPrize).toLocaleString()}`}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={createContest.isPending || uploadContestImages.isPending} size="sm">
                  {createContest.isPending ? 'Creating...' : 'Create Contest'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate({ to: '/admin/contests' })}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Categories & Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Categories & Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">

                  <div className="space-y-2">
                    <Label className="text-sm">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="h-8 text-sm"
                      />
                      <Button type="button" variant="outline" onClick={addTag} size="sm" className="h-8 text-xs">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Contest Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Active Contest</Label>
                      <p className="text-xs text-muted-foreground">
                        Contest will be visible and accessible to participants
                      </p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Public Contest</Label>
                      <p className="text-xs text-muted-foreground">
                        Contest will be visible to all users
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Allow Voting</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable public voting for contest entries
                      </p>
                    </div>
                    <Switch
                      checked={formData.allowVoting}
                      onCheckedChange={(checked) => handleInputChange('allowVoting', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
