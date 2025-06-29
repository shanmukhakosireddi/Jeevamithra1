import React, { useState } from 'react';
import { useLocalAuth } from '../../hooks/useLocalAuth';
import { UserProfile } from '../../types/user';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Edit3, 
  Save, 
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LocalProfileSectionProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  teluguMode: boolean;
}

export const LocalProfileSection: React.FC<LocalProfileSectionProps> = ({ 
  userProfile, 
  setUserProfile, 
  teluguMode 
}) => {
  const { updateProfile } = useLocalAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editForm, setEditForm] = useState({
    fullName: userProfile.fullName,
    phone: userProfile.phone,
    age: userProfile.age.toString(),
    gender: userProfile.gender
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await updateProfile({
        fullName: editForm.fullName,
        phone: editForm.phone,
        age: parseInt(editForm.age),
        gender: editForm.gender,
        updatedAt: new Date()
      });

      if (result.success) {
        const updatedProfile = {
          ...userProfile,
          fullName: editForm.fullName,
          phone: editForm.phone,
          age: parseInt(editForm.age),
          gender: editForm.gender,
          updatedAt: new Date()
        };

        setUserProfile(updatedProfile);
        setIsEditing(false);
        setMessage({
          type: 'success',
          text: teluguMode ? 'ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ అయ్యింది' : 'Profile updated successfully'
        });

        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || (teluguMode ? 'ప్రొఫైల్ అప్‌డేట్ విఫలమైంది' : 'Failed to update profile')
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: teluguMode ? 'ప్రొఫైల్ అప్‌డేట్ విఫలమైంది' : 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male':
        return teluguMode ? 'పురుషుడు' : 'Male';
      case 'female':
        return teluguMode ? 'స్త్రీ' : 'Female';
      case 'other':
        return teluguMode ? 'ఇతర' : 'Other';
      default:
        return gender;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              👤 {teluguMode ? 'నా ప్రొఫైల్' : 'My Profile'}
            </h2>
            <p className="text-sm text-gray-600">
              {teluguMode ? 'మీ వ్యక్తిగత సమాచారాన్ని నిర్వహించండి' : 'Manage your personal information'}
            </p>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Edit3 size={16} />
            <span>{teluguMode ? 'సవరించు' : 'Edit'}</span>
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          <span className={`text-sm font-medium ${
            message.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {message.text}
          </span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
                {userProfile.photoURL ? (
                  <img 
                    src={userProfile.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-500" />
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mt-4">
              {userProfile.fullName}
            </h3>
            <p className="text-gray-600">
              {userProfile.email}
            </p>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{teluguMode ? 'పూర్తి పేరు' : 'Full Name'}</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {userProfile.fullName}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{teluguMode ? 'ఇమెయిల్' : 'Email'}</span>
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                {userProfile.email}
                <span className="text-xs text-gray-500 ml-2">
                  ({teluguMode ? 'మార్చలేము' : 'Cannot be changed'})
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{teluguMode ? 'ఫోన్ నంబర్' : 'Phone Number'}</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {userProfile.phone}
                </div>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{teluguMode ? 'వయస్సు' : 'Age'}</span>
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {userProfile.age} {teluguMode ? 'సంవత్సరాలు' : 'years'}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{teluguMode ? 'లింగం' : 'Gender'}</span>
              </label>
              {isEditing ? (
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({...editForm, gender: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">{teluguMode ? 'పురుషుడు' : 'Male'}</option>
                  <option value="female">{teluguMode ? 'స్త్రీ' : 'Female'}</option>
                  <option value="other">{teluguMode ? 'ఇతర' : 'Other'}</option>
                </select>
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                  {getGenderDisplay(userProfile.gender)}
                </div>
              )}
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {teluguMode ? 'సభ్యుడు అయిన తేదీ' : 'Member Since'}
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                {userProfile.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    fullName: userProfile.fullName,
                    phone: userProfile.phone,
                    age: userProfile.age.toString(),
                    gender: userProfile.gender
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={16} />
                <span>{teluguMode ? 'రద్దు' : 'Cancel'}</span>
              </button>
              
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{teluguMode ? 'సేవ్ చేస్తున్నాము...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{teluguMode ? 'సేవ్ చేయండి' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Local Storage Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-800">
            {teluguMode ? 'స్థానిక డేటాబేస్ సమాచారం' : 'Local Database Info'}
          </span>
        </div>
        <p className="text-xs text-blue-700">
          {teluguMode 
            ? 'మీ డేటా మీ బ్రౌజర్‌లో స్థానికంగా నిల్వ చేయబడుతుంది. బ్రౌజర్ డేటా క్లియర్ చేస్తే ఈ సమాచారం తొలగించబడుతుంది.'
            : 'Your data is stored locally in your browser. This information will be lost if you clear browser data.'
          }
        </p>
      </div>
    </div>
  );
};