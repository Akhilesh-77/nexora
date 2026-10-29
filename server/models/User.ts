import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  isActive: boolean;
  branch: string;
  customBranch?: string;
  degree: string;
  college: string;
  yearOrSemester: string;
  cgpa: string;
  gradYear: string;
  prefLanguage: string;
  targetRole: string;
  careerInterests: string[];
  skills: string[];
  preparationGoals: string[];
  prepLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  studyTime: string;
  learningPreferences: string[];
  onboarded: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student', index: true },
    isActive: { type: Boolean, default: true },
    branch: { type: String, default: 'Computer Science and Engineering' },
    customBranch: { type: String, default: '' },
    degree: { type: String, default: 'Bachelor of Technology (B.Tech.)' },
    college: { type: String, default: 'National Institute of Engineering' },
    yearOrSemester: { type: String, default: 'Final Year (7th/8th Sem)' },
    cgpa: { type: String, default: '8.5' },
    gradYear: { type: String, default: '2026' },
    prefLanguage: { type: String, default: 'Python' },
    targetRole: { type: String, default: 'Software Developer' },
    careerInterests: { type: [String], default: ['Software Developer'] },
    skills: { type: [String], default: [] },
    preparationGoals: { type: [String], default: [] },
    prepLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    studyTime: { type: String, default: '2 hours' },
    learningPreferences: { type: [String], default: ['Core Branch Subjects', 'General Aptitude'] },
    onboarded: { type: Boolean, default: false },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

