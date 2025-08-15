import React, { useState } from 'react';
import { ChevronRight, Ruler, Eye, Palette, User } from 'lucide-react';
import { FormData } from './index';

interface MeasurementsSceneProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  isTransitioning: boolean;
}

const MeasurementsScene: React.FC<MeasurementsSceneProps> = ({ formData, updateFormData, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.height.trim()) newErrors.height = 'Height is required';
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required';
    if (!formData.eyeColor) newErrors.eyeColor = 'Eye color is required';
    if (!formData.hairColor) newErrors.hairColor = 'Hair color is required';
    if (!formData.skinTone) newErrors.skinTone = 'Skin tone is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="relative">
      <div 
        className="scene-background"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
        }}
      />
      
      <div className="scene-content">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <div className="glass-card-dark">
            <div className="text-center mb-8">
              <Ruler className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h2 className="section-title">Your measurements matter</h2>
              <p className="text-gray-300">Precision in every detail</p>
            </div>

            <div className="space-y-6">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Height
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.height ? 'border-red-500' : ''}`}
                    placeholder={`5'8" / 173 cm`}
                    value={formData.height}
                    onChange={(e) => updateFormData({ height: e.target.value })}
                  />
                  {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Weight
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.weight ? 'border-red-500' : ''}`}
                    placeholder="120 lbs / 54 kg"
                    value={formData.weight}
                    onChange={(e) => updateFormData({ weight: e.target.value })}
                  />
                  {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400/10 to-pink-400/10 rounded-2xl p-6 border border-yellow-400/20">
                <h3 className="text-lg font-semibold mb-4 text-center">Body Measurements (Optional)</h3>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Bust/Chest</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`34" / 86 cm`}
                      value={formData.bust}
                      onChange={(e) => updateFormData({ bust: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Waist</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`26" / 66 cm`}
                      value={formData.waist}
                      onChange={(e) => updateFormData({ waist: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hips</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`36" / 91 cm`}
                      value={formData.hips}
                      onChange={(e) => updateFormData({ hips: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Physical Features</h3>
                
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Eye Color
                    </label>
                    <select
                      className={`form-select ${errors.eyeColor ? 'border-red-500' : ''}`}
                      value={formData.eyeColor}
                      onChange={(e) => updateFormData({ eyeColor: e.target.value })}
                    >
                      <option value="">Select eye color</option>
                      <option value="blue">Blue</option>
                      <option value="brown">Brown</option>
                      <option value="green">Green</option>
                      <option value="hazel">Hazel</option>
                      <option value="gray">Gray</option>
                      <option value="amber">Amber</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.eyeColor && <p className="text-red-400 text-sm mt-1">{errors.eyeColor}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Hair Color
                    </label>
                    <select
                      className={`form-select ${errors.hairColor ? 'border-red-500' : ''}`}
                      value={formData.hairColor}
                      onChange={(e) => updateFormData({ hairColor: e.target.value })}
                    >
                      <option value="">Select hair color</option>
                      <option value="blonde">Blonde</option>
                      <option value="brunette">Brunette</option>
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="auburn">Auburn</option>
                      <option value="gray">Gray</option>
                      <option value="white">White</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.hairColor && <p className="text-red-400 text-sm mt-1">{errors.hairColor}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Skin Tone</label>
                    <select
                      className={`form-select ${errors.skinTone ? 'border-red-500' : ''}`}
                      value={formData.skinTone}
                      onChange={(e) => updateFormData({ skinTone: e.target.value })}
                    >
                      <option value="">Select skin tone</option>
                      <option value="fair">Fair</option>
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="olive">Olive</option>
                      <option value="tan">Tan</option>
                      <option value="dark">Dark</option>
                      <option value="deep">Deep</option>
                    </select>
                    {errors.skinTone && <p className="text-red-400 text-sm mt-1">{errors.skinTone}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button 
                onClick={handleNext}
                className="btn-primary flash-effect group"
              >
                Show My Portfolio
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsScene;