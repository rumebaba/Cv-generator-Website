import { Document, Page, View, Text, StyleSheet, Font, Link } from '@react-pdf/renderer';
import React from 'react';

import type { FormData, FormState } from '../../types/form';

Font.register({
  family: 'Helvetica',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/Helvetica/Helvetica-Regular.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/Helvetica/Helvetica-Bold.ttf',
      fontWeight: 'bold' as const,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/Helvetica/Helvetica-Oblique.ttf',
      fontStyle: 'italic' as const,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/Helvetica/Helvetica-BoldOblique.ttf',
      fontWeight: 'bold' as const,
      fontStyle: 'italic' as const,
    },
  ],
});

Font.register({
  family: 'DejaVu',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/DejaVu/DejaVuSans.ttf' },
    {
      src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/DejaVu/DejaVuSans-Bold.ttf',
      fontWeight: 'bold' as const,
    },
  ],
});

interface CVTemplateProps {
  formState: FormState;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1e293b',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 5,
    fontSize: 9,
    color: '#64748b',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 3,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 3,
  },
  text: {
    fontSize: 9.5,
    color: '#334155',
    marginBottom: 2,
  },
  textSmall: {
    fontSize: 9,
    color: '#64748b',
  },
  role: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  company: {
    fontSize: 10,
    color: '#4f46e5',
    marginBottom: 2,
  },
  dateLocation: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 3,
    fontSize: 9.5,
    color: '#334155',
  },
  bullet: {
    marginRight: 6,
    color: '#4f46e5',
  },
  skillTag: {
    backgroundColor: '#eef2ff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 8.5,
    color: '#4f46e5',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
});

const renderIf = (condition: boolean, content: React.ReactNode) => {
  return condition ? content : null;
};

const CVTemplate: React.FC<CVTemplateProps> = ({ formState }) => {
  const { data } = formState;
  const {
    personalData,
    introduction,
    educations,
    experiences,
    medicalScience,
    projects,
    skills,
    credentials,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalData.fullName || 'Your Name'}</Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 5,
              fontSize: 9,
              color: '#64748b',
            }}
          >
            {personalData.email && <Text>✉ {personalData.email}</Text>}
            {personalData.phone && <Text>☎ {personalData.phone}</Text>}
            {(personalData.city || personalData.country) && (
              <Text>
                📍 {personalData.city || ''}
                {personalData.city && personalData.country ? ', ' : ''}
                {personalData.country || ''}
              </Text>
            )}
            {personalData.linkedin && <Text>🔗 {personalData.linkedin}</Text>}
            {personalData.nationality && <Text>🌐 {personalData.nationality}</Text>}
            {personalData.visaStatus && <Text>🛂 {personalData.visaStatus}</Text>}
          </View>

          {personalData.customSocialLinks && personalData.customSocialLinks.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 10,
                marginTop: 5,
              }}
            >
              {personalData.customSocialLinks.map((link, i) => (
                <Text
                  key={i}
                  style={{ fontSize: 8, color: '#4f46e5', textDecoration: 'underline' }}
                >
                  {link.label}: {link.url}
                </Text>
              ))}
            </View>
          )}
        </View>

        {introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{introduction.professionalSummary}</Text>
          </View>
        )}

        {introduction.objectiveStatement && introduction.objectiveStatement.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Objective</Text>
            <Text style={styles.text}>{introduction.objectiveStatement}</Text>
          </View>
        )}

        {introduction.keyCareerMilestones && introduction.keyCareerMilestones.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Career Milestones</Text>
            <Text style={styles.text}>{introduction.keyCareerMilestones}</Text>
          </View>
        )}

        {introduction.targetJobTitles && introduction.targetJobTitles.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target Positions</Text>
            <Text style={styles.text}>{introduction.targetJobTitles}</Text>
          </View>
        )}

        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp, index) => (
              <View
                key={exp.id || index}
                style={{ marginBottom: index < experiences.length - 1 ? 12 : 0 }}
              >
                <Text style={styles.role}>{exp.position}</Text>
                {exp.company && <Text style={styles.company}>{exp.company}</Text>}
                {(exp.startDate || exp.endDate || exp.current) && (
                  <Text style={styles.dateLocation}>
                    {exp.startDate &&
                      `${new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    {' - '}
                    {exp.current
                      ? 'Present'
                      : exp.endDate &&
                        new Date(exp.endDate + '-01').toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                    {exp.location && ` | ${exp.location}`}
                  </Text>
                )}
                {exp.directReports && exp.directReports.trim() && (
                  <Text style={styles.textSmall}>👥 {exp.directReports} direct reports</Text>
                )}
                {exp.toolsUsed && exp.toolsUsed.trim() && (
                  <Text style={styles.textSmall}>🛠 {exp.toolsUsed}</Text>
                )}
                {exp.achievements && exp.achievements.trim() && (
                  <>
                    {exp.achievements
                      .split('\n')
                      .filter(Boolean)
                      .map((bullet, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            marginLeft: 10,
                            marginBottom: 3,
                            fontSize: 9.5,
                            color: '#334155',
                          }}
                        >
                          <Text style={{ marginRight: 6, color: '#4f46e5' }}>•</Text>
                          <Text style={styles.text}>{bullet.trim()}</Text>
                        </View>
                      ))}
                  </>
                )}
                {exp.description && exp.description.trim() && (
                  <Text style={styles.text}>{exp.description}</Text>
                )}
                {exp.reasonForLeaving && exp.reasonForLeaving.trim() && (
                  <Text style={styles.textSmall}>
                    <strong>Reason for leaving:</strong> {exp.reasonForLeaving}
                  </Text>
                )}
                {exp.salaryHistory && exp.salaryHistory.trim() && (
                  <Text style={styles.textSmall}>
                    <strong>Salary progression:</strong> {exp.salaryHistory}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {educations && educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu, index) => (
              <View
                key={edu.id || index}
                style={{ marginBottom: index < educations.length - 1 ? 10 : 0 }}
              >
                <Text style={styles.role}>
                  {edu.degree}: {edu.fieldOfStudy}
                </Text>
                {edu.institution && <Text style={styles.company}>{edu.institution}</Text>}
                {(edu.startDate || edu.endDate || edu.current) && (
                  <Text style={styles.dateLocation}>
                    {edu.startDate &&
                      `${new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    {' - '}
                    {edu.current
                      ? 'Present'
                      : edu.endDate &&
                        new Date(edu.endDate + '-01').toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                    {edu.location && ` | ${edu.location}`}
                  </Text>
                )}
                {edu.gpa && edu.gpa.trim() && <Text style={styles.textSmall}>GPA: {edu.gpa}</Text>}
                {edu.classRank && edu.classRank.trim() && (
                  <Text style={styles.textSmall}>Class Rank: {edu.classRank}</Text>
                )}
                {edu.thesisTopic && edu.thesisTopic.trim() && (
                  <Text style={styles.textSmall}>
                    <strong>Thesis:</strong> {edu.thesisTopic}
                  </Text>
                )}
                {edu.academicHonors && edu.academicHonors.trim() && (
                  <Text style={styles.textSmall}>
                    <strong>Honors:</strong> {edu.academicHonors}
                  </Text>
                )}
                {edu.relevantClasses && edu.relevantClasses.trim() && (
                  <Text style={styles.textSmall}>
                    <strong>Relevant Coursework:</strong> {edu.relevantClasses}
                  </Text>
                )}
                {edu.description && edu.description.trim() && (
                  <Text style={styles.text}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {medicalScience && medicalScience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical & Science Background</Text>
            {medicalScience.map((ms, index) => (
              <View
                key={ms.id || index}
                style={{ marginBottom: index < medicalScience.length - 1 ? 10 : 0 }}
              >
                {ms.clinicalRotations && ms.clinicalRotations.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Clinical Rotations</Text>
                    <Text style={styles.text}>{ms.clinicalRotations}</Text>
                  </>
                )}
                {ms.researchGrants && ms.researchGrants.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Research Grants</Text>
                    <Text style={styles.text}>{ms.researchGrants}</Text>
                  </>
                )}
                {ms.publications && ms.publications.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Publications</Text>
                    <Text style={styles.text}>{ms.publications}</Text>
                  </>
                )}
                {ms.medicalLicenses && ms.medicalLicenses.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Licenses & Certifications</Text>
                    <Text style={styles.text}>{ms.medicalLicenses}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, index) => (
              <View
                key={project.id || index}
                style={{ marginBottom: index < projects.length - 1 ? 12 : 0 }}
              >
                <Text style={styles.role}>{project.name}</Text>
                {project.role && (
                  <Text style={{ ...styles.company, fontStyle: 'italic' }}>
                    Role: {project.role}
                  </Text>
                )}
                {(project.startDate || project.endDate || project.current) && (
                  <Text style={styles.dateLocation}>
                    {project.startDate &&
                      `${new Date(project.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    {' - '}
                    {project.current
                      ? 'Present'
                      : project.endDate &&
                        new Date(project.endDate + '-01').toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                  </Text>
                )}
                {project.technicalArchitecture && project.technicalArchitecture.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Technical Architecture</Text>
                    <Text style={styles.textSmall}>{project.technicalArchitecture}</Text>
                  </>
                )}
                {project.description && project.description.trim() && (
                  <Text style={styles.text}>{project.description}</Text>
                )}
                {project.codeRepositoryUrl && project.codeRepositoryUrl.trim() && (
                  <Link
                    href={project.codeRepositoryUrl}
                    style={{ ...styles.textSmall, color: '#4f46e5', textDecoration: 'underline' }}
                  >
                    🔗 Code Repository
                  </Link>
                )}
                {project.liveDemoUrl && project.liveDemoUrl.trim() && (
                  <Link
                    href={project.liveDemoUrl}
                    style={{ ...styles.textSmall, color: '#4f46e5', textDecoration: 'underline' }}
                  >
                    🌐 Live Demo
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Competencies</Text>
            {skills.map((skill, index) => (
              <View
                key={skill.id || index}
                style={{ marginBottom: index < skills.length - 1 ? 10 : 0 }}
              >
                {skill.technicalSkills && skill.technicalSkills.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Technical Skills</Text>
                    <View
                      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}
                    >
                      {skill.technicalSkills.split(',').map((s, i) => (
                        <Text key={i} style={styles.skillTag}>
                          {s.trim()}
                        </Text>
                      ))}
                    </View>
                  </>
                )}
                {skill.softSkills && skill.softSkills.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Soft Skills</Text>
                    <View
                      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}
                    >
                      {skill.softSkills.split(',').map((s, i) => (
                        <Text key={i} style={styles.skillTag}>
                          {s.trim()}
                        </Text>
                      ))}
                    </View>
                  </>
                )}
                {skill.spokenLanguages && skill.spokenLanguages.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Spoken Languages</Text>
                    <View
                      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}
                    >
                      {skill.spokenLanguages.split(',').map((s, i) => (
                        <Text key={i} style={styles.skillTag}>
                          {s.trim()}
                        </Text>
                      ))}
                    </View>
                  </>
                )}
                {(skill.proficiencyLevel ||
                  (skill.yearsOfExperience !== undefined && skill.yearsOfExperience > 0)) && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {skill.proficiencyLevel && (
                      <View style={{ width: '48%' }}>
                        <Text style={styles.subsectionTitle}>Proficiency Level</Text>
                        <Text style={styles.text}>
                          {skill.proficiencyLevel.charAt(0).toUpperCase() +
                            skill.proficiencyLevel.slice(1)}
                        </Text>
                      </View>
                    )}
                    {skill.yearsOfExperience !== undefined && skill.yearsOfExperience > 0 && (
                      <View style={{ width: '48%' }}>
                        <Text style={styles.subsectionTitle}>Years of Experience</Text>
                        <Text style={styles.text}>{skill.yearsOfExperience} years</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {credentials && credentials.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Credentials & Extras</Text>
            {credentials.map((cred, index) => (
              <View
                key={cred.id || index}
                style={{ marginBottom: index < credentials.length - 1 ? 12 : 0 }}
              >
                <Text style={styles.role}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.company}>{cred.issuer}</Text>}
                {(cred.dateIssued || cred.expirationDate) && (
                  <Text style={styles.dateLocation}>
                    {cred.dateIssued &&
                      `Issued: ${new Date(cred.dateIssued + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    {cred.expirationDate
                      ? ` | Exp: ${new Date(cred.expirationDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                      : ''}
                  </Text>
                )}
                {cred.credentialId && cred.credentialId.trim() && (
                  <Text style={styles.textSmall}>Credential ID: {cred.credentialId}</Text>
                )}
                {cred.securityClearance && cred.securityClearance !== 'None' && (
                  <Text style={styles.textSmall}>
                    <strong>Security Clearance:</strong> {cred.securityClearance}
                  </Text>
                )}
                {cred.volunteerWork && cred.volunteerWork.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Volunteer Work</Text>
                    <Text style={styles.text}>{cred.volunteerWork}</Text>
                  </>
                )}
                {cred.hobbies && cred.hobbies.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Hobbies & Interests</Text>
                    <Text style={styles.textSmall}>{cred.hobbies}</Text>
                  </>
                )}
                {cred.militaryService && cred.militaryService.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>Military Service</Text>
                    <Text style={styles.text}>{cred.militaryService}</Text>
                  </>
                )}
                {cred.references && cred.references.trim() && (
                  <>
                    <Text style={styles.subsectionTitle}>References</Text>
                    <Text style={styles.textSmall}>{cred.references}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        <View
          style={{
            marginTop: 30,
            paddingTop: 15,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            textAlign: 'center',
          }}
        >
          <Text style={{ fontSize: 8, color: '#94a3b8' }}>
            Generated by CV Generator •{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplate;
