import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';

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
    flexDirection: 'column',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1e293b',
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    color: '#64748b',
  },
  headerRight: {
    alignItems: 'flex-end',
    fontSize: 8.5,
    color: '#64748b',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
    marginLeft: 8,
  },
  role: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  company: {
    fontSize: 10,
    color: '#059669',
    marginBottom: 2,
  },
  date: {
    fontSize: 8.5,
    color: '#64748b',
    marginBottom: 3,
  },
  text: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 2,
  },
  bullet: {
    marginRight: 5,
    color: '#059669',
    fontSize: 9,
  },
  skillTag: {
    backgroundColor: '#ecfdf5',
    borderRadius: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontSize: 8,
    color: '#059669',
    marginRight: 4,
    marginBottom: 4,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 20,
  },
  col: {
    flex: 1,
  },
});

const CVTemplateMinimal: React.FC<CVTemplateProps> = ({ formState }) => {
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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{personalData.fullName || 'Your Name'}</Text>
            {personalData.email && <Text style={styles.title}>{personalData.email}</Text>}
            {(personalData.city || personalData.country) && (
              <Text style={styles.title}>
                {personalData.city || ''}
                {personalData.city && personalData.country ? ', ' : ''}
                {personalData.country || ''}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            {personalData.phone && <Text>{personalData.phone}</Text>}
            {personalData.linkedin && <Text>{personalData.linkedin}</Text>}
            {personalData.nationality && <Text>{personalData.nationality}</Text>}
          </View>
        </View>

        {introduction.professionalSummary && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>Summary</Text>
              <View style={styles.sectionLine} />
            </View>
            <Text style={styles.text}>{introduction.professionalSummary}</Text>
          </View>
        )}

        {introduction.objectiveStatement && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>Objective</Text>
              <View style={styles.sectionLine} />
            </View>
            <Text style={styles.text}>{introduction.objectiveStatement}</Text>
          </View>
        )}

        {experiences.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>Experience</Text>
              <View style={styles.sectionLine} />
            </View>
            {experiences.map((exp, i) => (
              <View key={exp.id || i} style={{ marginBottom: i < experiences.length - 1 ? 10 : 0 }}>
                <Text style={styles.role}>{exp.position}</Text>
                {exp.company && <Text style={styles.company}>{exp.company}</Text>}
                {(exp.startDate || exp.endDate) && (
                  <Text style={styles.date}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    {exp.location ? ` | ${exp.location}` : ''}
                  </Text>
                )}
                {exp.achievements &&
                  exp.achievements
                    .split('\n')
                    .filter(Boolean)
                    .map((b, j) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bullet}>-</Text>
                        <Text style={styles.text}>{b.trim()}</Text>
                      </View>
                    ))}
                {exp.description && <Text style={styles.text}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {educations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>Education</Text>
              <View style={styles.sectionLine} />
            </View>
            {educations.map((edu, i) => (
              <View key={edu.id || i} style={{ marginBottom: i < educations.length - 1 ? 8 : 0 }}>
                <Text style={styles.role}>
                  {edu.degree}: {edu.fieldOfStudy}
                </Text>
                {edu.institution && <Text style={styles.company}>{edu.institution}</Text>}
                {(edu.startDate || edu.endDate) && (
                  <Text style={styles.date}>
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </Text>
                )}
                {edu.gpa && <Text style={styles.text}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>Skills</Text>
              <View style={styles.sectionLine} />
            </View>
            {skills.map((skill, i) => (
              <View key={skill.id || i} style={{ marginBottom: 6 }}>
                {skill.technicalSkills && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                    {skill.technicalSkills.split(',').map((s, j) => (
                      <Text key={j} style={styles.skillTag}>
                        {s.trim()}
                      </Text>
                    ))}
                  </View>
                )}
                {skill.softSkills && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                    {skill.softSkills.split(',').map((s, j) => (
                      <Text key={j} style={styles.skillTag}>
                        {s.trim()}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>Projects</Text>
              <View style={styles.sectionLine} />
            </View>
            {projects.map((project, i) => (
              <View key={project.id || i} style={{ marginBottom: i < projects.length - 1 ? 8 : 0 }}>
                <Text style={styles.role}>{project.name}</Text>
                {project.role && <Text style={styles.company}>{project.role}</Text>}
                {project.description && <Text style={styles.text}>{project.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {credentials.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>Credentials</Text>
              <View style={styles.sectionLine} />
            </View>
            {credentials.map((cred, i) => (
              <View key={cred.id || i} style={{ marginBottom: i < credentials.length - 1 ? 6 : 0 }}>
                <Text style={styles.role}>{cred.certificateName}</Text>
                {cred.issuer && <Text style={styles.company}>{cred.issuer}</Text>}
              </View>
            ))}
          </View>
        )}

        {references.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text>References</Text>
              <View style={styles.sectionLine} />
            </View>
            {references.map((ref, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.text}>
                  {ref.name} - {ref.title} at {ref.company} ({ref.email})
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateMinimal;
