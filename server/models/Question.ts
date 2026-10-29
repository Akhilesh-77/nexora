import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  branch: string;
  subject: string;
  topic: string;
  role?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hints: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    branch: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    topic: { type: String, required: true, index: true },
    role: { type: String, default: 'All', index: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true, index: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    explanation: { type: String, required: true },
    hints: { type: [String], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

QuestionSchema.index({ branch: 1, subject: 1, difficulty: 1 });
QuestionSchema.index({ subject: 1, difficulty: 1 });
QuestionSchema.index({ role: 1, difficulty: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

