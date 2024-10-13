import { cvType } from "~/types/resume";

export const mockJobOffer = `Job Title: Experienced Teacher

Location: Maplewood Academy, Springfield, IL
Job Type: Full-time
Start Date: August 15, 2024

About Us:
Maplewood Academy is a dedicated educational institution committed to fostering a nurturing and dynamic learning environment for our students. We pride ourselves on our innovative teaching methods and our emphasis on academic excellence, character development, and community engagement.

Position Overview:
We are seeking a passionate and dedicated teacher to join our team. The ideal candidate will have a strong background in elementary education, possess excellent communication skills, and demonstrate a commitment to student-centered learning.

Responsibilities:

    Develop and implement engaging lesson plans that align with curriculum standards.
    Foster a positive classroom environment that encourages student participation and collaboration.
    Assess and monitor student progress, providing constructive feedback to support growth.
    Communicate effectively with students, parents, and colleagues to promote a supportive learning community.
    Participate in professional development opportunities and contribute to school initiatives.

Qualifications:

    Bachelor’s degree in Education or a related field (Master’s preferred).
    Valid teaching certification for elementary education.
    3+ years of teaching experience, preferably in a classroom setting.
    Strong organizational and interpersonal skills.
    Proficiency in educational technology and classroom management software.

What We Offer:

    Competitive salary and benefits package.
    Opportunities for professional development and advancement.
    Supportive and collaborative work environment.
    Mentorship programs and flexible scheduling options.

How to Apply:
Interested candidates should submit their resume, cover letter, and references to hiring@maplewoodacademy.edu by July 15, 2024. Please include "Teacher Application - [Your Name]" in the subject line.

Join us at Maplewood Academy and make a difference in the lives of our students!`;

export const mockCVData: cvType = {
  name: "John",
  surname: "Doe",
  professionalTitle: "Software Engineer",
  contact: {
    phone: "+123456789",
    email: "john.doe@example.com",
    linkedin: "linkedin.com/in/johndoe",
    portfolio: "www.johndoe.com",
  },
  profile:
    "Experienced software engineer with a passion for developing innovative solutions. Proficient in modern web technologies and agile methodologies.",
  skills: [
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "CSS",
    "HTML",
    "TypeScript",
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
    { name: "French", level: "Advanced" },
  ],
  courses: [
    { name: "Advanced React", date: "2023" },
    { name: "Node.js for Beginners", date: "2022" },
  ],
  awards: [
    { name: "Best Developer", date: "2021" },
    { name: "Employee of the Month", date: "2022" },
  ],
  workExperience: [
    {
      jobTitle: "Senior Software Engineer",
      companyName: "Tech Solutions Inc.",
      dates: "2021 - Present",
      responsibilities: [
        "Lead a team of developers",
        "Architect scalable applications",
        "Mentor junior developers",
        "Collaborate with product managers",
      ],
    },
    {
      jobTitle: "Software Engineer",
      companyName: "Web Innovations LLC",
      dates: "2019 - 2021",
      responsibilities: [
        "Developed responsive web applications",
        "Worked with RESTful APIs",
        "Participated in code reviews",
        "Maintained project documentation",
      ],
    },
  ],
  education: [
    {
      dates: "2015 - 2019",
      universityName: "University of Example",
      location: "Example City, Example Country",
      degreeAndMajor: "Bachelor's Degree in Computer Science",
    },
  ],
};
