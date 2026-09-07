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
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 8.5, color: '#222', lineHeight: 1.4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2 solid #222', paddingBottom: 8, marginBottom: 12 },
  photo: { width: 45, height: 45, borderRadius: 23 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  contactBlock: { textAlign: 'right' as const, fontSize: 7.5, color: '#555' },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#222', textTransform: 'uppercase' as const, backgroundColor: '#f5f5f5', paddingHorizontal: 6, paddingVertical: 3, marginBottom: 6 },
  row: { flexDirection: 'row', marginBottom: 6 },
  rowLeft: { flex: 1 },
  rowRight: { width: 90, textAlign: 'right' as const, fontSize: 7.5, color: '#777' },
  title: { fontSize: 9, fontWeight: 'bold', color: '#222' },
  sub: { fontSize: 8, color: '#555', fontStyle: 'italic' as const },
  text: { fontSize: 8.5, color: '#333', marginTop: 2 },
  textSmall: { fontSize: 7.5, color: '#666', marginTop: 1 },
  inline: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  pill: { backgroundColor: '#eee', fontSize: 7.5, paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 2 },
  compactEntry: { marginBottom: 6 },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bullet: { width: 10, fontSize: 8, color: '#555' },
  bulletText: { flex: 1, fontSize: 8.5, color: '#333' },
});

export const CVTemplateCompact: React.FC<Props> = ({ formState }) => {
  const { data } = formState;
  const { personalData: pd, introduction, experiences, educations, projects, skills, credentials, references } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {pd.profilePhotoUrl && (
              <Image style={s.photo} src={pd.profilePhotoUrl} />
            )}
            <Text style={s.name}>{pd.fullName}</Text>
          </View>
          <View style={s.contactBlock}>
            {pd.email && <Text>{pd.email}</Text>}
            {pd.phone && <Text>{pd.phone}</Text>}
            {pd.city && <Text>{pd.city}{pd.country ? `, ${pd.country}` : ''}</Text>}
            {pd.linkedin && <Text>{pd.linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {introduction.professionalSummary && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text style={s.text}>{stripHtml(introduction.professionalSummary)}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={s.compactEntry}>
                <View style={s.row}>
                  <View style={s.rowLeft}>
                    <Text style={s.title}>{exp.position}{exp.company ? ` — ${exp.company}` : ''}</Text>
                    {exp.location && <Text style={s.sub}>{exp.location}</Text>}
                  </View>
                  <Text style={s.rowRight}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
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
              <View key={edu.id} style={s.compactEntry}>
                <View style={s.row}>
                  <View style={s.rowLeft}>
                    <Text style={s.title}>{getDegreeLabel(edu.degree)}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''} — {edu.institution}</Text>
                  </View>
                  <Text style={s.rowRight}>{formatDateRange(edu.startDate, edu.endDate, edu.current)}</Text>
                </View>
                {edu.gpa && <Text style={s.textSmall}>{getResultLabel(edu.resultType, edu.gpa)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && skills.some((sk) => sk.technicalSkills) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.inline}>
              {skills.filter((sk) => sk.technicalSkills).map((sk) =>
                sk.technicalSkills.split(',').map((skill, i) => (
                  <Text key={`${sk.id}-${i}`} style={s.pill}>{skill.trim()}</Text>
                ))
              )}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={s.compactEntry}>
                <View style={s.row}>
                  <View style={s.rowLeft}>
                    <Text style={s.title}>{proj.name}{proj.role ? ` (${proj.role})` : ''}</Text>
                  </View>
                  <Text style={s.rowRight}>{formatDateRange(proj.startDate, proj.endDate, proj.current)}</Text>
                </View>
                {proj.description && <Text style={s.text}>{stripHtml(proj.description)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Credentials */}
        {credentials.length > 0 && credentials.some((c) => c.certificateName) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            <View style={s.inline}>
              {credentials.filter((c) => c.certificateName).map((cred) => (
                <Text key={cred.id} style={s.pill}>{cred.certificateName} ({cred.issuer}){cred.dateIssued ? ` - ${cred.dateIssued}` : ''}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {skills.length > 0 && skills.some((sk) => sk.spokenLanguages) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Languages</Text>
            <Text style={s.text}>
              {skills.filter((sk) => sk.spokenLanguages).map((sk) => sk.spokenLanguages).join(', ')}
            </Text>
          </View>
        )}

        {/* References */}
        {references.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>References</Text>
            <Text style={s.textSmall}>
              {references.map((r) => `${r.name} (${r.title}, ${r.company})`).join(' | ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVTemplateCompact;
