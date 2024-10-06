export interface CvObjI {
  name: string;
  surname: string;
  professionalTitle: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    portfolio: string;
  };
  profile: string;
  skills: string[];
  languages: Array<{
    name: string;
    level: string;
  }>;
  courses: Array<{
    name: string;
    date: string;
  }>;
  awards: Array<{
    name: string;
    date: string;
  }>;
  workExperience: Array<{
    jobTitle: string;
    companyName: string;
    dates: string;
    responsibilities: string[];
  }>;
  education: Array<{
    dates: string;
    universityName: string;
    location: string;
    degreeAndMajor: string;
  }>;
}
