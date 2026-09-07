import { Document, Page, View, Text, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

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
  ],
});

interface CVTemplateProps {
  formState: FormState;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1e293b',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 25,
  },
  main: {
    flex: 1,
    padding: 30,
  },
  sidebarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    alignSelf: 'center',
  },
  sidebarTitle: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarSectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  sidebarText: {
    fontSize: 8.5,
    color: '#cbd5e1',
    marginBottom: 3,
  },
  sidebarItem: {
    marginBottom: 8,
  },
  sidebarLabel: {
    fontSize: 8,
    color: '#94a3b8',
    marginBottom: 1,
  },
  sidebarValue: {
    fontSize: 8.5,
    color: '#f1f5f9',
  },
  mainSection: {
    marginBottom: 16,
  },
  mainSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
    paddingBottom: 3,
  },
  mainRole: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  mainCompany: {
    fontSize: 10,
    color: '#6366f1',
    marginBottom: 2,
  },
  mainDate: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
  },
  mainText: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 2,
  },
  bullet: {
    marginRight: 5,
    color: '#6366f1',
    fontSize: 9,
  },
  skillTag: {
    backgroundColor: '#eef2ff',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: '#4f46e5',
    marginRight: 4,
    marginBottom: 4,
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
});

const CVTemplateModern: React.FC<CVTemplateProps> = ({ formState }) => {
  const { data } = formState;
  const {
    personalData,
    introduction,
    educations,
    experiences,
    projects,
    skills,
    credentials,
    references,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          {personalData.profilePhotoUrl && (
            <Image style={styles.photo} src={personalData.profilePhotoUrl} />
          )}
          <Text style={styles.sidebarName}>{personalData.fullName || 'Your Name'}</Text>
          <Text style={styles.sidebarTitle}>Professional CV</Text>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            {personalData.email && <Text style={styles.sidebarText}>{personalData.email}</Text>}
            {personalData.phone && <Text style={styles.sidebarText}>{personalData.phone}</Text>}
            {(personalData.city || personalData.country) && (
              <Text style={styles.sidebarText}>
                {personalData.city || ''}
                {personalData.city && personalData.country ? ', ' : ''}
                {personalData.country || ''}
              </Text>
            )}
            {personalData.linkedin && (
              <Text style={styles.sidebarText}>{personalData.linkedin}</Text>
            )}
          </View>

          {skills.length > 0 && skills.some((s) => s.technicalSkills) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Technical Skills</Text>
              {skills
                .filter((s) => s.technicalSkills)
                .map((skill, i) => (
                  <View key={i} style={{ marginBottom: 4 }}>
                    {skill.technicalSkills.split(',').map((s, j) => (
                      <Text key={j} style={styles.sidebarText}>
                        {s.trim()}
                      </Text>
                    ))}
                  </View>
                ))}
            </View>
          )}

          {skills.length > 0 && skills.some((s) => s.softSkills) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Soft Skills</Text>
              {skills
                .filter((s) => s.softSkills)
                .map((skill, i) => (
                  <View key={i} style={{ marginBottom: 4 }}>
                    {skill.softSkills.split(',').map((s, j) => (
                      <Text key={j} style={styles.sidebarText}>
                        {s.trim()}
                      </Text>
                    ))}
                  </View>
                ))}
            </View>
          )}

          {skills.length > 0 && skills.some((s) => s.spokenLanguages) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Languages</Text>
              {skills
                .filter((s) => s.spokenLanguages)
                .map((skill, i) => (
                  <View key={i} style={{ marginBottom: 4 }}>
                    {skill.spokenLanguages.split(',').map((s, j) => (
                      <Text key={j} style={styles.sidebarText}>
                        {s.trim()}
                      </Text>
                    ))}
                  </View>
                ))}
            </View>
          )}

          {references.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>References</Text>
              {references.map((ref, i) => (
                <View key={i} style={styles.sidebarItem}>
                  <Text style={styles.sidebarValue}>{ref.name}</Text>
                  <Text style={styles.sidebarLabel}>
                    {ref.title} at {ref.company}
                  </Text>
                  <Text style={styles.sidebarLabel}>{ref.email}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.main}>
          {introduction.professionalSummary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Professional Summary</Text>
              <Text style={styles.mainText}>{stripHtml(introduction.professionalSummary)}</Text>
            </View>
          )}

          {introduction.objectiveStatement && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Career Objective</Text>
              <Text style={styles.mainText}>{introduction.objectiveStatement}</Text>
            </View>
          )}

          {experiences.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Experience</Text>
              {experiences.map((exp, i) => (
                <View
                  key={exp.id || i}
                  style={{ marginBottom: i < experiences.length - 1 ? 12 : 0 }}
                >
                  <Text style={styles.mainRole}>{exp.position}</Text>
                  {exp.company && <Text style={styles.mainCompany}>{exp.company}</Text>}
                  {(exp.startDate || exp.endDate) && (
                    <Text style={styles.mainDate}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      {exp.location ? ` | ${exp.location}` : ''}
                    </Text>
                  )}
                  {exp.directReports && (
                    <Text style={styles.mainText}>Direct Reports: {exp.directReports}</Text>
                  )}
                  {exp.achievements &&
                    stripHtml(exp.achievements)
                      .split('\n')
                      .filter(Boolean)
                      .map((b, j) => (
                        <View key={j} style={styles.bulletRow}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.mainText}>{b.trim()}</Text>
                        </View>
                      ))}
                  {exp.description && <Text style={styles.mainText}>{stripHtml(exp.description)}</Text>}
                </View>
              ))}
            </View>
          )}

          {educations.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Education</Text>
              {educations.map((edu, i) => (
                <View
                  key={edu.id || i}
                  style={{ marginBottom: i < educations.length - 1 ? 10 : 0 }}
                >
                  <Text style={styles.mainRole}>
                    {edu.degree}: {edu.fieldOfStudy}
                  </Text>
                  {edu.institution && <Text style={styles.mainCompany}>{edu.institution}</Text>}
                  {(edu.startDate || edu.endDate) && (
                    <Text style={styles.mainDate}>
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </Text>
                  )}
                  {edu.gpa && <Text style={styles.mainText}>GPA: {edu.gpa}</Text>}
                  {edu.thesisTopic && (
                    <Text style={styles.mainText}>Thesis: {edu.thesisTopic}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Projects</Text>
              {projects.map((project, i) => (
                <View
                  key={project.id || i}
                  style={{ marginBottom: i < projects.length - 1 ? 10 : 0 }}
                >
                  <Text style={styles.mainRole}>{project.name}</Text>
                  {project.role && <Text style={styles.mainCompany}>Role: {project.role}</Text>}
                  {project.description && (
                    <Text style={styles.mainText}>{stripHtml(project.description)}</Text>
                  )}
                  {project.codeRepositoryUrl && (
                    <Link
                      href={project.codeRepositoryUrl}
                      style={{ ...styles.mainText, color: '#6366f1', textDecoration: 'underline' }}
                    >
                      Code Repository
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

          {credentials.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle}>Credentials</Text>
              {credentials.map((cred, i) => (
                <View
                  key={cred.id || i}
                  style={{ marginBottom: i < credentials.length - 1 ? 8 : 0 }}
                >
                  <Text style={styles.mainRole}>{cred.certificateName}</Text>
                  {cred.issuer && <Text style={styles.mainCompany}>{cred.issuer}</Text>}
                  {cred.credentialId && (
                    <Text style={styles.mainText}>ID: {cred.credentialId}</Text>
                  )}
                  {cred.volunteerWork && (
                    <Text style={styles.mainText}>Volunteer: {cred.volunteerWork}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplateModern;
