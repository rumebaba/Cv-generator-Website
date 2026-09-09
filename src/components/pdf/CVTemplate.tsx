import { Document, Page, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormData, FormState } from '../../types/form';
import { stripHtml } from '../../utils/stripHtml';
import { getDegreeLabel, getResultLabel } from '../../utils/cvHelpers';

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

interface CVTemplateProps {
  formState: FormState;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#1e293b',
  },
  header: {
    padding: 30,
    marginBottom: 20,
    backgroundColor: '#1e3a5f',
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    alignSelf: 'center',
  },
  nameBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 34,
  },
  targetTitle: {
    fontSize: 11,
    color: '#a8c4f0',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
  contactInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  contactItem: {
    fontSize: 8.5,
    color: '#c8d8e8',
    textAlign: 'center',
    marginBottom: 2,
  },
  contactSeparator: {
    fontSize: 8.5,
    color: '#6b8299',
    textAlign: 'center',
    marginBottom: 2,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a5f',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
    paddingBottom: 3,
  },
  subsectionTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
    marginBottom: 2,
  },
  text: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 2,
  },
  textSmall: {
    fontSize: 8,
    color: '#64748b',
  },
  role: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  company: {
    fontSize: 9,
    color: '#1e3a5f',
    marginBottom: 1,
  },
  dateLocation: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 2,
  },
  bullet: {
    width: 8,
    fontSize: 9,
    color: '#1e3a5f',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
  },
  skillTag: {
    backgroundColor: '#eef2ff',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    fontSize: 8,
    color: '#1e3a5f',
  },
});

const CVTemplate: React.FC<CVTemplateProps> = ({ formState }) => {
  const { data } = formState;
  const {
    personalData: pd,
    introduction,
    educations,
    experiences,
    medicalScience,
    projects,
    skills,
    credentials,
  } = data;

  const formatEnd = (current: boolean, endDate: string) => {
    if (current) return 'Present';
    if (endDate) {
      return new Date(endDate + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
    return 'Present';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {pd.profilePhotoUrl && (
            <Image style={styles.photo} src={pd.profilePhotoUrl} />
          )}
          <View style={styles.nameBlock}>
            <Text style={styles.name}>
              {pd.fullName || 'Your Name'}
            </Text>
            {introduction.targetJobTitles && introduction.targetJobTitles.trim() && (
              <Text style={styles.targetTitle}>{introduction.targetJobTitles}</Text>
            )}
          </View>
          <View style={styles.contactInfo}>
            {pd.email && <Text style={styles.contactItem}>{pd.email}</Text>}
            {pd.phone && (
              <>
                <Text style={styles.contactItem}>{pd.phone}</Text>
              </>
            )}
            {(pd.city || pd.country) && (
              <Text style={styles.contactItem}>
                {pd.city || ''}{pd.city && pd.country ? ', ' : ''}{pd.country || ''}
              </Text>
            )}
            {pd.nationality && <Text style={styles.contactItem}>{pd.nationality}</Text>}
          </View>
          {pd.linkedin && (
            <Text style={styles.contactItem}>{pd.linkedin}</Text>
          )}
          {pd.customSocialLinks && pd.customSocialLinks.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              {pd.customSocialLinks.map((link, i) => (
                <Text key={i} style={{ fontSize: 8, color: '#c8d8e8' }}>
                  {link.label}: {link.url}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {introduction.professionalSummary && introduction.professionalSummary.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{stripHtml(introduction.professionalSummary)}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp, index) => (
              <View key={exp.id || index} style={{ marginBottom: index < experiences.length - 1 ? 10 : 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={styles.role}>{exp.position}</Text>
                  {(exp.startDate || exp.endDate || exp.current) && (
                    <Text style={styles.dateLocation}>
                      {exp.startDate && `${new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      {' - '}
                      {formatEnd(exp.current, exp.endDate)}
                    </Text>
                  )}
                </View>
                {exp.company && (
                  <Text style={styles.company}>
                    {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                  </Text>
                )}
                {exp.toolsUsed && exp.toolsUsed.trim() && (
                  <Text style={styles.textSmall}>Tools: {exp.toolsUsed}</Text>
                )}
                {exp.achievements && exp.achievements.trim() && (
                  <>
                    {stripHtml(exp.achievements)
                      .split('\n')
                      .filter(Boolean)
                      .map((bullet, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.bulletText}>{bullet.trim()}</Text>
                        </View>
                      ))}
                  </>
                )}
                {exp.description && exp.description.trim() && (
                  <Text style={styles.text}>{stripHtml(exp.description)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {educations && educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu, index) => (
              <View key={edu.id || index} style={{ marginBottom: index < educations.length - 1 ? 8 : 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={styles.role}>
                    {getDegreeLabel(edu.degree)}{edu.fieldOfStudy ? `: ${edu.fieldOfStudy}` : ''}
                  </Text>
                  {(edu.startDate || edu.endDate || edu.current) && (
                    <Text style={styles.dateLocation}>
                      {edu.startDate && `${new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      {' - '}
                      {formatEnd(edu.current, edu.endDate)}
                    </Text>
                  )}
                </View>
                {edu.institution && (
                  <Text style={styles.company}>
                    {edu.institution}{edu.location ? ` | ${edu.location}` : ''}
                  </Text>
                )}
                {edu.gpa && edu.gpa.trim() && (
                  <Text style={styles.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>
                )}
                {edu.classRank && edu.classRank.trim() && (
                  <Text style={styles.textSmall}>Class Rank: {edu.classRank}</Text>
                )}
                {edu.relevantClasses && edu.relevantClasses.trim() && (
                  <Text style={styles.textSmall}>Coursework: {edu.relevantClasses}</Text>
                )}
                {edu.description && edu.description.trim() && (
                  <Text style={styles.text}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, index) => (
              <View key={project.id || index} style={{ marginBottom: index < projects.length - 1 ? 8 : 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={styles.role}>{project.name}</Text>
                  {(project.startDate || project.endDate || project.current) && (
                    <Text style={styles.dateLocation}>
                      {project.startDate && `${new Date(project.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      {' - '}
                      {formatEnd(project.current, project.endDate)}
                    </Text>
                  )}
                </View>
                {project.role && (
                  <Text style={styles.company}>{project.role}</Text>
                )}
                {project.technicalArchitecture && project.technicalArchitecture.trim() && (
                  <Text style={styles.textSmall}>{project.technicalArchitecture}</Text>
                )}
                {project.description && project.description.trim() && (
                  <>
                    {stripHtml(project.description)
                      .split('\n')
                      .filter(Boolean)
                      .map((line, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.bulletText}>{line.trim()}</Text>
                        </View>
                      ))}
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skill, index) => (
              <View key={skill.id || index} style={{ marginBottom: 4 }}>
                {skill.technicalSkills && skill.technicalSkills.trim() && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 3 }}>
                    {skill.technicalSkills.split(',').map((s, i) => (
                      <Text key={i} style={styles.skillTag}>{s.trim()}</Text>
                    ))}
                  </View>
                )}
                {skill.softSkills && skill.softSkills.trim() && (
                  <Text style={styles.textSmall}>Soft Skills: {skill.softSkills}</Text>
                )}
                {skill.spokenLanguages && skill.spokenLanguages.trim() && (
                  <Text style={styles.textSmall}>Languages: {skill.spokenLanguages}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Credentials */}
        {credentials && credentials.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {credentials.map((cred, index) => (
              <View key={cred.id || index} style={{ marginBottom: index < credentials.length - 1 ? 6 : 0 }}>
                <Text style={styles.role}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.company}>{cred.issuer}</Text>}
                {(cred.dateIssued || cred.expirationDate) && (
                  <Text style={styles.dateLocation}>
                    {cred.dateIssued && `${new Date(cred.dateIssued + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    {cred.expirationDate ? ` - ${new Date(cred.expirationDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Medical & Science */}
        {medicalScience && medicalScience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical & Science</Text>
            {medicalScience.map((ms, index) => (
              <View key={ms.id || index} style={{ marginBottom: index < medicalScience.length - 1 ? 6 : 0 }}>
                {ms.clinicalRotations && ms.clinicalRotations.trim() && (
                  <Text style={styles.text}>Clinical Rotations: {ms.clinicalRotations}</Text>
                )}
                {ms.researchGrants && ms.researchGrants.trim() && (
                  <Text style={styles.text}>Research Grants: {ms.researchGrants}</Text>
                )}
                {ms.publications && ms.publications.trim() && (
                  <Text style={styles.text}>Publications: {ms.publications}</Text>
                )}
                {ms.medicalLicenses && ms.medicalLicenses.trim() && (
                  <Text style={styles.text}>Licenses: {ms.medicalLicenses}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplate;
