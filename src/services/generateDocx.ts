import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';

import type { FormData } from '../types/form';

function cleanText(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

function createSectionTitle(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: 24,
        color: '4F46E5',
        font: 'Calibri',
      }),
    ],
    spacing: { before: 300, after: 100 },
    border: {
      bottom: { color: 'E2E8F0', space: 4, style: BorderStyle.SINGLE, size: 6 },
    },
  });
}

function createBullet(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `\u2022 ${cleanText(text)}`,
        size: 20,
        font: 'Calibri',
      }),
    ],
    spacing: { after: 40 },
    indent: { left: 360 },
  });
}

function createBodyText(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: cleanText(text),
        size: 20,
        font: 'Calibri',
      }),
    ],
    spacing: { after: 60 },
  });
}

function createSmallText(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: cleanText(text),
        size: 18,
        color: '64748B',
        font: 'Calibri',
      }),
    ],
    spacing: { after: 40 },
  });
}

export async function generateDocxBlob(formData: FormData): Promise<Blob> {
  const {
    personalData,
    introduction,
    experiences,
    educations,
    medicalScience,
    projects,
    skills,
    credentials,
    references,
  } = formData;

  const children: Paragraph[] = [];

  // Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalData.fullName || 'Your Name',
          bold: true,
          size: 48,
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  // Contact info
  const contactParts: string[] = [];
  if (personalData.email) contactParts.push(personalData.email);
  if (personalData.phone) contactParts.push(personalData.phone);
  if (personalData.city || personalData.country) {
    contactParts.push(
      `${personalData.city || ''}${personalData.city && personalData.country ? ', ' : ''}${personalData.country || ''}`
    );
  }
  if (personalData.linkedin) contactParts.push(personalData.linkedin);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(' | '),
            size: 18,
            color: '64748B',
            font: 'Calibri',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Professional Summary
  if (introduction.professionalSummary && cleanText(introduction.professionalSummary)) {
    children.push(createSectionTitle('Professional Summary'));
    children.push(createBodyText(introduction.professionalSummary));
  }

  // Career Objective
  if (introduction.objectiveStatement && cleanText(introduction.objectiveStatement)) {
    children.push(createSectionTitle('Career Objective'));
    children.push(createBodyText(introduction.objectiveStatement));
  }

  // Key Milestones
  if (introduction.keyCareerMilestones && cleanText(introduction.keyCareerMilestones)) {
    children.push(createSectionTitle('Key Career Milestones'));
    introduction.keyCareerMilestones
      .split('\n')
      .filter(Boolean)
      .forEach((line) => {
        children.push(createBullet(line.trim()));
      });
  }

  // Target Job Titles
  if (introduction.targetJobTitles && cleanText(introduction.targetJobTitles)) {
    children.push(createSectionTitle('Target Positions'));
    children.push(createBodyText(introduction.targetJobTitles));
  }

  // Experience
  if (experiences.length > 0) {
    children.push(createSectionTitle('Professional Experience'));
    experiences.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: exp.position, bold: true, size: 22, font: 'Calibri' })],
          spacing: { before: 120, after: 40 },
        })
      );
      if (exp.company) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.company, size: 20, color: '4F46E5', font: 'Calibri' }),
            ],
            spacing: { after: 40 },
          })
        );
      }
      const dateParts: string[] = [];
      if (exp.startDate) dateParts.push(exp.startDate);
      if (exp.endDate) dateParts.push(exp.current ? 'Present' : exp.endDate);
      if (dateParts.length > 0 || exp.location) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${dateParts.join(' - ')}${exp.location ? ` | ${exp.location}` : ''}`,
                size: 18,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 40 },
          })
        );
      }
      if (exp.directReports && cleanText(exp.directReports)) {
        children.push(createSmallText(`Direct Reports: ${exp.directReports}`));
      }
      if (exp.toolsUsed && cleanText(exp.toolsUsed)) {
        children.push(createSmallText(`Tools Used: ${exp.toolsUsed}`));
      }
      if (exp.achievements && cleanText(exp.achievements)) {
        exp.achievements
          .split('\n')
          .filter(Boolean)
          .forEach((line) => {
            children.push(createBullet(line.trim()));
          });
      }
      if (exp.description && cleanText(exp.description)) {
        children.push(createBodyText(exp.description));
      }
      if (exp.reasonForLeaving && cleanText(exp.reasonForLeaving)) {
        children.push(createSmallText(`Reason for leaving: ${exp.reasonForLeaving}`));
      }
      if (exp.salaryHistory && cleanText(exp.salaryHistory)) {
        children.push(createSmallText(`Salary progression: ${exp.salaryHistory}`));
      }
    });
  }

  // Education
  if (educations.length > 0) {
    children.push(createSectionTitle('Education'));
    educations.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree}: ${edu.fieldOfStudy}`,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
          ],
          spacing: { before: 120, after: 40 },
        })
      );
      if (edu.institution) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.institution, size: 20, color: '4F46E5', font: 'Calibri' }),
            ],
            spacing: { after: 40 },
          })
        );
      }
      const dateParts: string[] = [];
      if (edu.startDate) dateParts.push(edu.startDate);
      if (edu.endDate) dateParts.push(edu.current ? 'Present' : edu.endDate);
      if (dateParts.length > 0 || edu.location) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${dateParts.join(' - ')}${edu.location ? ` | ${edu.location}` : ''}`,
                size: 18,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 40 },
          })
        );
      }
      if (edu.gpa && cleanText(edu.gpa)) children.push(createSmallText(`GPA: ${edu.gpa}`));
      if (edu.classRank && cleanText(edu.classRank))
        children.push(createSmallText(`Class Rank: ${edu.classRank}`));
      if (edu.thesisTopic && cleanText(edu.thesisTopic))
        children.push(createSmallText(`Thesis: ${edu.thesisTopic}`));
      if (edu.academicHonors && cleanText(edu.academicHonors))
        children.push(createSmallText(`Honors: ${edu.academicHonors}`));
      if (edu.relevantClasses && cleanText(edu.relevantClasses))
        children.push(createSmallText(`Relevant Coursework: ${edu.relevantClasses}`));
      if (edu.description && cleanText(edu.description))
        children.push(createBodyText(edu.description));
    });
  }

  // Medical & Science
  if (medicalScience.length > 0) {
    children.push(createSectionTitle('Medical & Science Background'));
    medicalScience.forEach((ms) => {
      if (ms.clinicalRotations && cleanText(ms.clinicalRotations)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Clinical Rotations', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(ms.clinicalRotations));
      }
      if (ms.researchGrants && cleanText(ms.researchGrants)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Research Grants', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(ms.researchGrants));
      }
      if (ms.publications && cleanText(ms.publications)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Publications', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(ms.publications));
      }
      if (ms.medicalLicenses && cleanText(ms.medicalLicenses)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Licenses & Certifications',
                bold: true,
                size: 20,
                font: 'Calibri',
              }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(ms.medicalLicenses));
      }
    });
  }

  // Projects
  if (projects.length > 0) {
    children.push(createSectionTitle('Projects'));
    projects.forEach((project) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: project.name, bold: true, size: 22, font: 'Calibri' })],
          spacing: { before: 120, after: 40 },
        })
      );
      if (project.role) {
        children.push(createSmallText(`Role: ${project.role}`));
      }
      const dateParts: string[] = [];
      if (project.startDate) dateParts.push(project.startDate);
      if (project.endDate) dateParts.push(project.current ? 'Present' : project.endDate);
      if (dateParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: dateParts.join(' - '),
                size: 18,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 40 },
          })
        );
      }
      if (project.technicalArchitecture && cleanText(project.technicalArchitecture)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Technical Architecture',
                bold: true,
                size: 20,
                font: 'Calibri',
              }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createSmallText(project.technicalArchitecture));
      }
      if (project.description && cleanText(project.description))
        children.push(createBodyText(project.description));
      if (project.codeRepositoryUrl && cleanText(project.codeRepositoryUrl)) {
        children.push(createSmallText(`Code Repository: ${project.codeRepositoryUrl}`));
      }
      if (project.liveDemoUrl && cleanText(project.liveDemoUrl)) {
        children.push(createSmallText(`Live Demo: ${project.liveDemoUrl}`));
      }
    });
  }

  // Skills
  if (skills.length > 0) {
    children.push(createSectionTitle('Skills & Competencies'));
    skills.forEach((skill) => {
      if (skill.technicalSkills && cleanText(skill.technicalSkills)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Technical Skills', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(skill.technicalSkills));
      }
      if (skill.softSkills && cleanText(skill.softSkills)) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'Soft Skills', bold: true, size: 20, font: 'Calibri' })],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(skill.softSkills));
      }
      if (skill.spokenLanguages && cleanText(skill.spokenLanguages)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Spoken Languages', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(skill.spokenLanguages));
      }
      if (skill.proficiencyLevel) {
        children.push(
          createSmallText(
            `Proficiency: ${skill.proficiencyLevel.charAt(0).toUpperCase() + skill.proficiencyLevel.slice(1)}`
          )
        );
      }
      if (skill.yearsOfExperience !== undefined && skill.yearsOfExperience > 0) {
        children.push(createSmallText(`Years of Experience: ${skill.yearsOfExperience}`));
      }
    });
  }

  // Credentials
  if (credentials.length > 0) {
    children.push(createSectionTitle('Credentials & Extras'));
    credentials.forEach((cred) => {
      if (cred.certificateName && cleanText(cred.certificateName)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: cred.certificateName, bold: true, size: 22, font: 'Calibri' }),
            ],
            spacing: { before: 120, after: 40 },
          })
        );
      }
      if (cred.issuer && cleanText(cred.issuer)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: cred.issuer, size: 20, color: '4F46E5', font: 'Calibri' }),
            ],
            spacing: { after: 40 },
          })
        );
      }
      if (cred.credentialId && cleanText(cred.credentialId))
        children.push(createSmallText(`Credential ID: ${cred.credentialId}`));
      if (cred.securityClearance && cred.securityClearance !== 'None')
        children.push(createSmallText(`Security Clearance: ${cred.securityClearance}`));
      if (cred.volunteerWork && cleanText(cred.volunteerWork)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Volunteer Work', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(cred.volunteerWork));
      }
      if (cred.hobbies && cleanText(cred.hobbies)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Hobbies & Interests', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createSmallText(cred.hobbies));
      }
      if (cred.militaryService && cleanText(cred.militaryService)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Military Service', bold: true, size: 20, font: 'Calibri' }),
            ],
            spacing: { before: 80, after: 40 },
          })
        );
        children.push(createBodyText(cred.militaryService));
      }
    });
  }

  // References
  if (references.length > 0) {
    children.push(createSectionTitle('References'));
    references.forEach((ref) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: ref.name, bold: true, size: 22, font: 'Calibri' })],
          spacing: { before: 100, after: 40 },
        })
      );
      if (ref.title) children.push(createSmallText(ref.title));
      if (ref.company) children.push(createSmallText(ref.company));
      const contactParts: string[] = [];
      if (ref.email) contactParts.push(ref.email);
      if (ref.phone) contactParts.push(ref.phone);
      if (contactParts.length > 0) children.push(createSmallText(contactParts.join(' | ')));
      if (ref.relationship) children.push(createSmallText(`Relationship: ${ref.relationship}`));
    });
  }

  // Footer
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated by CV Generator \u2022 ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
          size: 16,
          color: '94A3B8',
          font: 'Calibri',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
