import { Link } from "@remix-run/react";
import React from "react";
import { Colors } from "~/types/color";
import { cvType, resumeType } from "~/types/resume";
import { appendHttps } from "~/utils";

interface CVProps {
  data: cvType;
  color: Colors
}

const CVComponent = ({ data, color }: CVProps) => {
  const {
    name,
    surname,
    professionalTitle,
    contact,
    profile,
    skills,
    languages,
    workExperience,
  } = data;

  return (
    <div className={`w-full h-auto relative bg-white border-4 border-${color}-50 p-6`}>
      {/* Header with Name and Professional Title */}
      <div className="text-center mb-4">
        <h1 className={`text-slate-800 text-3xl font-semibold font-['Inter'] border-b border-${color}-800 pb-2 mb-2`}>
          {name} {surname}
        </h1>
        <div className={`text-black text-xl font-normal font-['Inter'] border-b border-${color}-800 pb-2`}>
          {professionalTitle}
        </div>
      </div>

      {/* Main Layout with Left Sidebar and Right Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-2/5 pr-4">
          <div className={`w-full h-auto p-2 bg-${color}-50 rounded-lg`}>
            <div className={`font-['Inter'] text-black text-base font-medium leading-normal border-b border-${color}-800 mb-3`}>
              CONTACT
            </div>
            <div className="text-black text-sm font-medium font-['Inter'] leading-tight mb-2">
              {contact.phone && (
                <div className="flex flex-row items-center text-wrap mb-2">
                  <img src="/icons/phone.svg" className="mr-2" />
                  {contact.phone}
                </div>
              )}
              <div className="flex flex-row items-center text-wrap mb-2">
                <img src="/icons/mail.svg" className="mr-2" />
                {contact.email}
              </div>

              {contact.linkedin && (
                <div className="flex flex-row items-center mb-2">
                  <img src="/icons/linkedin.svg" className="mr-2" />
                  <Link to={appendHttps(contact.linkedin)}>
                    {contact.linkedin}
                  </Link>
                </div>
              )}

              {contact.portfolio && (
                <div className="flex flex-row items-center mb-2">
                  <img src="/icons/globe.svg" className="mr-2" />
                  <Link to={appendHttps(contact.portfolio)}>
                    {contact.portfolio}
                  </Link>
                </div>
              )}
            </div>
            <div className={`border-b border-${color}-800 my-3`}>
              <div className="text-black text-base font-medium font-['Inter'] leading-normal">
                SKILLS
              </div>
            </div>
            <ul className="list-disc pl-5 text-black text-xs font-medium font-['Inter'] leading-tight">
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
            <div className={`border-b border-${color}-800 my-3`}>
              <div className="text-black text-base font-medium font-['Inter'] leading-normal">
                LANGUAGES
              </div>
            </div>
            <ul className="text-black text-xs font-medium font-['Inter'] leading-tight">
              {languages.map((language, index) => (
                <li key={index}>{`${language.name} - ${language.level}`}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="w-2/3">
          <div className="mb-4">
            <div className={`text-black text-base font-medium font-medium-['Inter'] leading-normal mb-4 border-b border-${color}-800`}>
              PROFILE
            </div>
            <div className="text-justify text-black text-xs font-medium font-['Inter'] leading-tight mb-4">
              {profile}
            </div>
          </div>

          <div className={`w-full border-b border-${color}-800 mb-4`}>
            <div className="text-black text-base font-medium font-['Inter'] leading-normal">
              WORK EXPERIENCE
            </div>
          </div>

          {/* WORK EXPERIENCE Section */}
          <div className="flex flex-col gap-4 mb-4">
            {workExperience?.map((job, index) => (
              <div key={index} className="mb-4">
                <div className="text-black text-sm font-semibold font-['Inter'] leading-tight mb-1">
                  {job.jobTitle}
                </div>
                <div className="text-black text-xs font-medium font-['Inter'] leading-tight mb-1">
                  {job.companyName}
                </div>
                <div className="text-black text-sm font-semibold font-['Inter'] leading-tight mb-1">
                  {job.dates}
                </div>
                <div className="text-black text-xs font-medium font-['Inter'] leading-tight mb-1">
                  {job.responsibilities.join(" | ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVComponent;
