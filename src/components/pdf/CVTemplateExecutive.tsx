import { Document, Page, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';
import { getDegreeLabel, getResultLabel, htmlToBullets } from '../../utils/cvHelpers';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/Helvetica/Helvetica-Regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@react-pdf/renderer@3.1.14/fonts/Helvetica/Helvetica-Bold.ttf', fontWeight: 'bold' as const },
  ],
});

interface Props {
  formState: FormState;
}

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 9, color: '#1a1a2e', lineHeight: 1.5 },
  header: { backgroundColor: '#1a1a2e', color: '#ffffff', padding: 30, marginBottom: 20, textAlign: 'center' },
  photo: { width: 65, height: 65, borderRadius: 33, marginBottom: 10, alignSelf: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' as const, color: '#c9a84c' },
  subtitle: { fontSize: 10, color: '#b0b0b0', marginTop: 4, letterSpacing: 1 },
  contact: { fontSize: 8, color: '#999999', marginTop: 8 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#1a1a2e', textTransform: 'uppercase' as const, borderBottom: '1 solid #c9a84c', paddingBottom: 4, marginBottom: 8, letterSpacing: 1 },
  text: { fontSize: 9, color: '#333333', marginBottom: 4 },
  textSmall: { fontSize: 8, color: '#555555', marginBottom: 2 },
  label: { fontSize: 8, color: '#c9a84c', fontWeight: 'bold' as const },
  entry: { marginBottom: 10 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  entryTitle: { fontSize: 10, fontWeight: 'bold', color: '#1a1a2e' },
  entryDate: { fontSize: 8, color: '#888888' },
  entrySub: { fontSize: 9, color: '#555555', fontStyle: 'italic' as const, marginTop: 2 },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bullet: { width: 10, fontSize: 9, color: '#c9a84c' },
  bulletText: { flex: 1, fontSize: 9, color: '#333333' },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
  skillTag: { backgroundColor: '#f0e6d2', color: '#1a1a2e', fontSize: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2 },
});

export const CVTemplateExecutive: React.FC<Props> = ({ formState }) => {
  const { data } = formState;
  const { personalData: pd, introduction, experiences, educations, projects, skills, credentials, references } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          {pd.profilePhotoUrl && (
            <Image style={s.photo} src={pd.profilePhotoUrl} />
          )}
          <Text style={s.name}>{pd.fullName}</Text>
          {introduction.targetJobTitles && <Text style={s.subtitle}>{introduction.targetJobTitles}</Text>}
          <Text style={s.contact}>
            {pd.email}{pd.phone ? ` | ${pd.phone}` : ''}{pd.city ? ` | ${pd.city}` : ''}{pd.country ? `, ${pd.country}` : ''}
          </Text>
          {pd.linkedin && <Text style={s.contact}>LinkedIn: {pd.linkedin}</Text>}
        </View>

        {/* Summary */}
        {introduction.professionalSummary && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Professional Summary</Text>
            <Text style={s.text}>{stripHtml(introduction.professionalSummary)}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={s.entry}>
                <View style={s.entryHeader}>
                  <Text style={s.entryTitle}>{exp.position}{exp.company ? ` at ${exp.company}` : ''}</Text>
                  <Text style={s.entryDate}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                {exp.location && <Text style={s.entrySub}>{exp.location}</Text>}
                {exp.description && <Text style={s.text}>{stripHtml(exp.description)}</Text>}
                {exp.achievements && htmlToBullets(exp.achievements).map((b, j) => (
                  <View key={j} style={s.bulletRow}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={s.entry}>
                <View style={s.entryHeader}>
                  <Text style={s.entryTitle}>{getDegreeLabel(edu.degree)}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</Text>
                  <Text style={s.entryDate}>{formatDateRange(edu.startDate, edu.endDate, edu.current)}</Text>
                </View>
                <Text style={s.entrySub}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</Text>
                {edu.gpa && <Text style={s.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>}
                {edu.description && <Text style={s.text}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && skills.some((sk) => sk.technicalSkills) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Core Competencies</Text>
            <View style={s.skillRow}>
              {skills.filter((sk) => sk.technicalSkills).map((sk) =>
                sk.technicalSkills.split(',').map((skill, i) => (
                  <Text key={`${sk.id}-${i}`} style={s.skillTag}>{skill.trim()}</Text>
                ))
              )}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Key Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={s.entry}>
                <View style={s.entryHeader}>
                  <Text style={s.entryTitle}>{proj.name}</Text>
                  <Text style={s.entryDate}>{formatDateRange(proj.startDate, proj.endDate, proj.current)}</Text>
                </View>
                {proj.role && <Text style={s.entrySub}>{proj.role}</Text>}
                {proj.description && <Text style={s.text}>{stripHtml(proj.description)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Credentials */}
        {credentials.length > 0 && credentials.some((c) => c.certificateName) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            {credentials.filter((c) => c.certificateName).map((cred) => (
              <Text key={cred.id} style={s.text}>
                {cred.certificateName} — {cred.issuer} {cred.dateIssued ? `(${cred.dateIssued})` : ''}
              </Text>
            ))}
          </View>
        )}

        {/* References */}
        {references.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>References</Text>
            {references.map((ref) => (
              <Text key={ref.id} style={s.textSmall}>
                {ref.name}, {ref.title} at {ref.company} — {ref.email}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateExecutive;
