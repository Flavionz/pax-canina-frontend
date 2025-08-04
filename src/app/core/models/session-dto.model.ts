// src/app/core/models/session-dto.model.ts
export interface SessionDto {
  idSession?: number;
  date: string;
  level?: string;
  startTime?: string;
  endTime?: string;
  maxCapacity?: number;
  registrationsCount?: number;
  description?: string;
  location?: string;
  imageUrl?: string;
  status?: string;
  // Course relation
  courseId?: number;
  courseName?: string;
  // Coach relation
  coachId?: number;
  coachFirstName?: string;
  coachLastName?: string;
  // AgeGroup relation
  ageGroupId?: number;
  ageGroupName?: string;
  minAge?: number;
  maxAge?: number;
}
