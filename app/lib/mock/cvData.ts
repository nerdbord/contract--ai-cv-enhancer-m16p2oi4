import { CvObjI } from "../types/cvTypes";
export const cvData: CvObjI = {
  name: "JAN",
  surname: "KOWALSKI",
  professionalTitle: "Full Stack Developer",
  contact: {
    phone: "+48 123 456 789",
    email: "jan.kowalski@example.com",
    linkedin: "linkedin.com/in/jankowalski",
    portfolio: "jankowalski.com",
  },
  profile:
    "Doświadczony Full Stack Developer z ponad 5-letnim stażem w tworzeniu skalowalnych aplikacji webowych. Specjalizuję się w technologiach JavaScript, z szczególnym naciskiem na React, Node.js i TypeScript. Pasjonat clean code i ciągłego rozwoju.",
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Docker",
    "Git",
    "Agile/Scrum",
  ],
  languages: [
    { name: "Polski", level: "Ojczysty" },
    { name: "Angielski", level: "C1" },
    { name: "Niemiecki", level: "B1" },
  ],
  courses: [
    { name: "Advanced React Patterns", date: "2022" },
    { name: "MongoDB University: M001: MongoDB Basics", date: "2021" },
  ],
  awards: [
    { name: "Najlepszy pracownik roku", date: "2022" },
    { name: "Hackathon Winner - InnovateIT", date: "2021" },
  ],
  workExperience: [
    {
      jobTitle: "Senior Full Stack Developer",
      companyName: "TechCorp Sp. z o.o.",
      dates: "2021 - obecnie",
      responsibilities: [
        "Prowadzenie zespołu 5 developerów w projekcie e-commerce",
        "Implementacja mikroserwisów z użyciem Node.js i Docker",
        "Optymalizacja wydajności frontendu React, skutkująca 30% poprawą czasu ładowania",
        "Wprowadzenie CI/CD z wykorzystaniem GitLab i AWS",
      ],
    },
    {
      jobTitle: "Full Stack Developer",
      companyName: "WebSolutions S.A.",
      dates: "2018 - 2021",
      responsibilities: [
        "Rozwój i utrzymanie aplikacji SPA w React i Redux",
        "Projektowanie i implementacja RESTful API w Node.js",
        "Migracja bazy danych z MySQL do PostgreSQL",
        "Współpraca z działem UX przy projektowaniu interfejsu użytkownika",
      ],
    },
  ],
  education: [
    {
      dates: "2014 - 2018",
      universityName: "Politechnika Warszawska",
      location: "Warszawa",
      degreeAndMajor: "Inżynier, Informatyka",
    },
    {
      dates: "2018 - 2019",
      universityName: "Uniwersytet Warszawski",
      location: "Warszawa",
      degreeAndMajor: "Magister, Informatyka Stosowana i Systemy Informacyjne",
    },
  ],
};
