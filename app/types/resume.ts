import { z } from "zod";

export const resumeSchema = z.object({
  personalInformation: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
    links: z.object({
      linkedin: z.string().optional(),
      github: z.string().optional(),
      portfolio: z.string().optional(),
    }).optional()
  }),
  summary: z.object({
    text: z.string(),
  }).optional(),
  workExperience: z.array(
    z.object({
      jobTitle: z.string(),
      company: z.string(),
      location: z.string(),
      startDate: z.string(), // Consider using z.date() if you want actual date objects
      endDate: z.string().optional(), // For current jobs, the end date could be optional
      responsibilities: z.array(z.string()),
      achievements: z.array(z.string()).optional()
    })
  ).optional(),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      gpa: z.string().optional(),
      relevantCourses: z.array(z.string()).optional(),
    })
  ).optional(),
  skills: z.object({
    technicalSkills: z.array(z.string()),
    softSkills: z.array(z.string()).optional(),
  }).optional(),
  certifications: z.array(
    z.object({
      title: z.string(),
      issuer: z.string(),
      date: z.string(),
      url: z.string().optional(),
    })
  ).optional(),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      url: z.string().optional(),
      technologies: z.array(z.string()),
    })
  ).optional(),
  languages: z.array(
    z.object({
      language: z.string(),
      proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Fluent", "Native"])
    })
  ).optional(),
  volunteerExperience: z.array(
    z.object({
      role: z.string(),
      organization: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      responsibilities: z.array(z.string()),
    })
  ).optional(),
  publications: z.array(
    z.object({
      title: z.string(),
      publication: z.string(),
      date: z.string(),
      url: z.string().optional(),
    })
  ).optional(),
});

export type resumeType = z.infer<typeof resumeSchema>
