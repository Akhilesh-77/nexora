import mongoose, { Schema, Document } from 'mongoose';

export interface IRoleCatalogue extends Document {
  roleId: string;
  title: string;
  category: string;
  branches: string[];
  overview: string;
  requiredSkills: string[];
  coreConcepts: string[];
  prerequisites: string[];
  learningRoadmap: { phase: string; title: string; duration: string; topics: string[] }[];
  technicalInterviewQuestions: { question: string; answerGuidance: string; keywords: string[] }[];
  behavioralInterviewQuestions: { question: string; starFocus: string }[];
  exampleProjects: { title: string; stack: string; description: string }[];
  resumeGuidance: { keywords: string[]; actionVerbs: string[]; keyBulletExamples: string[] };
  assessmentCriteria: { metric: string; targetScore: number; description: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleCatalogueSchema = new Schema<IRoleCatalogue>(
  {
    roleId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    branches: { type: [String], default: [] },
    overview: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    coreConcepts: { type: [String], default: [] },
    prerequisites: { type: [String], default: [] },
    learningRoadmap: [
      {
        phase: String,
        title: String,
        duration: String,
        topics: [String],
      },
    ],
    technicalInterviewQuestions: [
      {
        question: String,
        answerGuidance: String,
        keywords: [String],
      },
    ],
    behavioralInterviewQuestions: [
      {
        question: String,
        starFocus: String,
      },
    ],
    exampleProjects: [
      {
        title: String,
        stack: String,
        description: String,
      },
    ],
    resumeGuidance: {
      keywords: [String],
      actionVerbs: [String],
      keyBulletExamples: [String],
    },
    assessmentCriteria: [
      {
        metric: String,
        targetScore: Number,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

export const RoleCatalogue = mongoose.model<IRoleCatalogue>('RoleCatalogue', RoleCatalogueSchema);

