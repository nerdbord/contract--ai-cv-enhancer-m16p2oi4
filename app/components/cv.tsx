import React from "react";
import { resumeType } from "~/types/resume";

interface CVProps {
  data: resumeType;
}

const CV = ({ data }: CVProps) => {
  const {
    personalInformation,
    summary,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    languages,
    volunteerExperience,
    publications,
  } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Personal Information */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {personalInformation.firstName} {personalInformation.lastName}
        </h1>
        <p className="text-gray-700">{personalInformation.email}</p>
        <p className="text-gray-700">{personalInformation.phone}</p>
        <p className="text-gray-500">
          {personalInformation.address.street},{" "}
          {personalInformation.address.city},{" "}
          {personalInformation.address.state},{" "}
          {personalInformation.address.postalCode},{" "}
          {personalInformation.address.country}
        </p>
        {personalInformation.links && (
          <div className="flex space-x-4 mt-2">
            {personalInformation.links.linkedin && (
              <a
                href={personalInformation.links.linkedin}
                className="text-blue-500"
              >
                LinkedIn
              </a>
            )}
            {personalInformation.links.github && (
              <a
                href={personalInformation.links.github}
                className="text-blue-500"
              >
                GitHub
              </a>
            )}
            {personalInformation.links.portfolio && (
              <a
                href={personalInformation.links.portfolio}
                className="text-blue-500"
              >
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p className="text-gray-700">{summary.text}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
          {workExperience.map((job, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">
                {job.jobTitle} - {job.company}
              </h3>
              <p className="text-gray-500">
                {job.location} | {job.startDate} - {job.endDate || "Present"}
              </p>
              <ul className="list-disc list-inside">
                {job.responsibilities.map((responsibility, idx) => (
                  <li key={idx}>{responsibility}</li>
                ))}
              </ul>
              {job.achievements && (
                <ul className="list-disc list-inside mt-2 text-green-500">
                  {job.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">
                {edu.degree} - {edu.institution}
              </h3>
              <p className="text-gray-500">
                {edu.location} | {edu.startDate} - {edu.endDate}
              </p>
              {edu.gpa && <p>GPA: {edu.gpa}</p>}
              {edu.relevantCourses && (
                <p>Relevant Courses: {edu.relevantCourses.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <h3 className="font-bold">Technical Skills:</h3>
          <ul className="list-disc list-inside mb-2">
            {skills.technicalSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          {skills.softSkills && (
            <>
              <h3 className="font-bold">Soft Skills:</h3>
              <ul className="list-disc list-inside">
                {skills.softSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Certifications */}
      {certifications && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <p>
                <strong>{cert.title}</strong> - {cert.issuer}
              </p>
              <p className="text-gray-500">{cert.date}</p>
              {cert.url && (
                <a href={cert.url} className="text-blue-500">
                  Certificate Link
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-bold">{project.name}</h3>
              <p>{project.description}</p>
              <p className="text-gray-500">
                Technologies: {project.technologies.join(", ")}
              </p>
              {project.url && (
                <a href={project.url} className="text-blue-500">
                  Project Link
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Languages</h2>
          <ul className="list-disc list-inside">
            {languages.map((lang, index) => (
              <li key={index}>
                {lang.language} - {lang.proficiency}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Volunteer Experience */}
      {volunteerExperience && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Volunteer Experience</h2>
          {volunteerExperience.map((vol, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">
                {vol.role} - {vol.organization}
              </h3>
              <p className="text-gray-500">
                {vol.location} | {vol.startDate} - {vol.endDate || "Present"}
              </p>
              <ul className="list-disc list-inside">
                {vol.responsibilities.map((responsibility, idx) => (
                  <li key={idx}>{responsibility}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Publications */}
      {publications && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Publications</h2>
          {publications.map((pub, index) => (
            <div key={index} className="mb-2">
              <p>
                <strong>{pub.title}</strong> - {pub.publication}
              </p>
              <p className="text-gray-500">{pub.date}</p>
              {pub.url && (
                <a href={pub.url} className="text-blue-500">
                  Publication Link
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CV;
