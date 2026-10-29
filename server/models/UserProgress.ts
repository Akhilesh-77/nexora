import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizAttempt {
  id: string;
  branch: string;
  subject: string;
  topic?: string;
  role?: string;
  difficulty: string;
  score: number; // percentage (0-100)
  totalQuestions: number;
  correctCount: number;
  answers: {
    questionId: string;
    questionText: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation: string;
  }[];
  completedAt: Date;
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  completedLessons: string[]; // module/lesson IDs
  completedModules: string[];
  bookmarks: string[]; // module IDs
  notes: { moduleId: string; text: string; updatedAt: Date }[];
  quizAttempts: IQuizAttempt[];
  aptitudeAttempts: {
    category: string;
    difficulty: string;
    score: number;
    total: number;
    completedAt: Date;
  }[];
  codingSolved: string[]; // coding problem IDs
  completedTasks: string[]; // daily task IDs
  interviewSessions: {
    id: string;
    targetRole: string;
    roundType: string;
    difficulty: string;
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    messages: any[];
    feedback: any;
    completedAt: Date;
  }[];
  resumeData?: any;
  assessmentResult?: any;
  assessmentAnswers?: Record<number, number>;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string; // YYYY-MM-DD
    activityDates: string[]; // unique YYYY-MM-DD strings
  };
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    completedLessons: { type: [String], default: [] },
    completedModules: { type: [String], default: [] },
    bookmarks: { type: [String], default: [] },
    notes: [
      {
        moduleId: { type: String, required: true },
        text: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    quizAttempts: [
      {
        id: { type: String, required: true },
        branch: { type: String, required: true },
        subject: { type: String, required: true },
        topic: String,
        role: String,
        difficulty: { type: String, required: true },
        score: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        correctCount: { type: Number, required: true },
        answers: [
          {
            questionId: String,
            questionText: String,
            selectedOption: Number,
            correctOption: Number,
            isCorrect: Boolean,
            explanation: String,
          },
        ],
        completedAt: { type: Date, default: Date.now },
      },
    ],
    aptitudeAttempts: [
      {
        category: String,
        difficulty: String,
        score: Number,
        total: Number,
        completedAt: { type: Date, default: Date.now },
      },
    ],
    codingSolved: { type: [String], default: [] },
    completedTasks: { type: [String], default: [] },
    interviewSessions: [
      {
        id: String,
        targetRole: String,
        roundType: String,
        difficulty: String,
        overallScore: Number,
        technicalScore: Number,
        communicationScore: Number,
        messages: [Schema.Types.Mixed],
        feedback: Schema.Types.Mixed,
        completedAt: { type: Date, default: Date.now },
      },
    ],
    resumeData: { type: Schema.Types.Mixed },
    assessmentResult: { type: Schema.Types.Mixed, default: null },
    assessmentAnswers: { type: Schema.Types.Mixed, default: {} },
    streak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActivityDate: { type: String, default: '' },
      activityDates: { type: [String], default: [] },
    },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

