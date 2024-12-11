import mongoose, { Document, Model } from "mongoose";

// Define the interface for LectureProgress
interface ILectureProgress {
  lecture: mongoose.Types.ObjectId;
  isCompleted: boolean;
  watchTime: number;
  lastWatched: Date;
}

// Define the interface for CourseProgress
interface ICourseProgress extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  isCompleted: boolean;
  completionPercentage: number;
  lectureProgress: ILectureProgress[];
  lastAccessed: Date;
  updatedLastAccessed(): Promise<ICourseProgress>;
}

// Define the schemas
const lectureProgressSchema = new mongoose.Schema<ILectureProgress>(
  {
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: [true, "Lecture reference is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    watchTime: {
      type: Number,
      default: 0,
    },
    lastWatched: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const courseProgressSchema = new mongoose.Schema<ICourseProgress>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lectureProgress: [lectureProgressSchema],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to calculate course completion
courseProgressSchema.pre<ICourseProgress>("save", function (next) {
  if (this.lectureProgress.length > 0) {
    const completedLectures = this.lectureProgress.filter(
      (lp) => lp.isCompleted
    ).length;

    this.completionPercentage = Math.round(
      (completedLectures / this.lectureProgress.length) * 100
    );

    this.isCompleted = this.completionPercentage === 100;
  }
  next();
});

// Method to update last accessed
courseProgressSchema.methods.updatedLastAccessed = function (
  this: ICourseProgress
): Promise<ICourseProgress> {
  this.lastAccessed = new Date();
  return this.save({ validateBeforeSave: false });
};

// Export the model
export const CourseProgress: Model<ICourseProgress> =
  mongoose.model<ICourseProgress>("CourseProgress", courseProgressSchema);
