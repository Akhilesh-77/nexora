import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningModule extends Document {
  moduleId: string;
  branch: string;
  subject: string;
  title: string;
  estimatedMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  order: number;
  learningObjectives: string[];
  prerequisites: string[];
  conceptIntroduction: string;
  simpleDefinition: string;
  detailedExplanation: string;
  importantTerminology: { term: string; definition: string }[];
  technicalArtifact?: {
    type: 'formula' | 'code' | 'diagram';
    title: string;
    content: string;
    explanation: string;
  };
  workedExamples: {
    title: string;
    scenario: string;
    stepByStep: string[];
    takeaway: string;
  }[];
  practicalApplications: string[];
  commonMistakes: { mistake: string; whyWrong: string; correctWay: string }[];
  practiceExercises: {
    title: string;
    problem: string;
    hint: string;
    solution: string;
  }[];
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  interviewPreparation?: {
    question: string;
    modelAnswer: string;
    recruiterTips: string;
  }[];
  revisionNotes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LearningModuleSchema = new Schema<ILearningModule>(
  {
    moduleId: { type: String, required: true, unique: true, index: true },
    branch: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    title: { type: String, required: true },
    estimatedMinutes: { type: Number, default: 25 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium', index: true },
    order: { type: Number, default: 1 },
    learningObjectives: { type: [String], default: [] },
    prerequisites: { type: [String], default: [] },
    conceptIntroduction: { type: String, required: true },
    simpleDefinition: { type: String, required: true },
    detailedExplanation: { type: String, required: true },
    importantTerminology: [
      {
        term: { type: String, required: true },
        definition: { type: String, required: true },
      },
    ],
    technicalArtifact: {
      type: { type: String, enum: ['formula', 'code', 'diagram'] },
      title: String,
      content: String,
      explanation: String,
    },
    workedExamples: [
      {
        title: String,
        scenario: String,
        stepByStep: [String],
        takeaway: String,
      },
    ],
    practicalApplications: { type: [String], default: [] },
    commonMistakes: [
      {
        mistake: String,
        whyWrong: String,
        correctWay: String,
      },
    ],
    practiceExercises: [
      {
        title: String,
        problem: String,
        hint: String,
        solution: String,
      },
    ],
    knowledgeCheck: [
      {
        question: String,
        options: [String],
        correctIndex: Number,
        explanation: String,
      },
    ],
    interviewPreparation: [
      {
        question: String,
        modelAnswer: String,
        recruiterTips: String,
      },
    ],
    revisionNotes: { type: [String], default: [] },
  },
  { timestamps: true }
);

LearningModuleSchema.index({ branch: 1, subject: 1 });

export const LearningModule = mongoose.model<ILearningModule>('LearningModule', LearningModuleSchema);

