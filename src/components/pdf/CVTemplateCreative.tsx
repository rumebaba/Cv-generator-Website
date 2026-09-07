import { Document, Page, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';
import React from 'react';

import type { FormState } from '../../types/form';
import { formatDateRange } from '../../utils/formatDate';
import { stripHtml } from '../../utils/stripHtml';

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
  page: { fontFamily: 'Helvetica', fontSize: 9, color: '#333' },
  container: { flexDirection: 'row', minHeight: '100%' as any },
  sidebar: { width: 200, backgroundColor: '#6c3ce0', color: '#ffffff', padding: 25 },
  photo: { width: 60, height: 60, borderRadius: 30, marginBottom: 10, alignSelf: 'center' },
  main: { flex: 1, padding: 25 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 9, color: '#d4c4f7', marginTop: 4 },
  sidebarSection: { marginBottom: 16 },
  sidebarTitle: { fontSize: 9, fontWeight: 'bold', color: '#d4c4f7', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6, borderBottom: '1 solid rgba(255,255,255,0.2)', paddingBottom: 3 },
  sidebarText: { fontSize: 8, color: '#e8e0ff', marginBottom: 3 },
  contactItem: { fontSize: 8, color: '#e8e0ff', marginBottom: 4 },
  mainSection: { marginBottom: 14 },
  mainTitle: { fontSize: 11, fontWeight: 'bold', color: '#6c3ce0', textTransform: 'uppercase' as const, marginBottom: 8, letterSpacing: 0.5 },
  entry: { marginBottom: 10 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  entryTitle: { fontSize: 10, fontWeight: 'bold', color: '#222' },
  entryDate: { fontSize: 8, color: '#888' },
  entrySub: { fontSize: 9, color: '#666', fontStyle: 'italic' as const, marginTop: 2 },
  text: { fontSize: 9, color: '#444', marginTop: 3 },
  textSmall: { fontSize: 8, color: '#666', marginTop: 2 },
  skillBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  skillName: { width: 80, fontSize: 8, color: '#fff' },
  skillTrack: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  skillFill: { height: 4, backgroundColor: '#d4c4f7', borderRadius: 2 },
  tag: { backgroundColor: '#f0eaff', color: '#6c3ce0', fontSize: 7, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, marginRight: 4, marginBottom: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
});

export const CVTemplateCreative: React.FC<Props> = ({ formState }) => {
  const { data } = formState;
  const { personalData: pd, introduction, experiences, educations, projects, skills, credentials, references } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.container}>
          {/* Sidebar */}
          <View style={s.sidebar}>
            {pd.profilePhotoUrl && (
              <Image style={s.photo} src={pd.profilePhotoUrl} />
            )}
            <Text style={s.name}>{pd.fullName}</Text>
            {introduction.targetJobTitles && <Text style={s.subtitle}>{introduction.targetJobTitles}</Text>}

            <View style={s.sidebarSection}>
              <Text style={s.sidebarTitle}>Contact</Text>
              {pd.email && <Text style={s.contactItem}>{pd.email}</Text>}
              {pd.phone && <Text style={s.contactItem}>{pd.phone}</Text>}
              {pd.city && <Text style={s.contactItem}>{pd.city}{pd.country ? `, ${pd.country}` : ''}</Text>}
              {pd.linkedin && <Text style={s.contactItem}>{pd.linkedin}</Text>}
            </View>

            {skills.length > 0 && skills.some((sk) => sk.technicalSkills) && (
              <View style={s.sidebarSection}>
                <Text style={s.sidebarTitle}>Skills</Text>
                {skills.filter((sk) => sk.technicalSkills).map((sk) =>
                  sk.technicalSkills.split(',').slice(0, 12).map((skill, i) => (
                    <Text key={`${sk.id}-${i}`} style={s.sidebarText}>{skill.trim()}</Text>
                  ))
                )}
              </View>
            )}

            {skills.length > 0 && skills.some((sk) => sk.spokenLanguages) && (
              <View style={s.sidebarSection}>
                <Text style={s.sidebarTitle}>Languages</Text>
                {skills.filter((sk) => sk.spokenLanguages).map((sk) =>
                  sk.spokenLanguages.split(',').map((lang, i) => (
                    <Text key={`${sk.id}-lang-${i}`} style={s.sidebarText}>{lang.trim()}</Text>
                  ))
                )}
              </View>
            )}

            {references.length > 0 && (
              <View style={s.sidebarSection}>
                <Text style={s.sidebarTitle}>References</Text>
                {references.map((ref) => (
                  <View key={ref.id} style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#fff' }}>{ref.name}</Text>
                    <Text style={{ fontSize: 7, color: '#d4c4f7' }}>{ref.title}</Text>
                    <Text style={{ fontSize: 7, color: '#d4c4f7' }}>{ref.email}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={s.main}>
            {introduction.professionalSummary && (
              <View style={s.mainSection}>
                <Text style={s.mainTitle}>About Me</Text>
                <Text style={s.text}>{stripHtml(introduction.professionalSummary)}</Text>
              </View>
            )}

            {experiences.length > 0 && (
              <View style={s.mainSection}>
                <Text style={s.mainTitle}>Experience</Text>
                {experiences.map((exp) => (
                  <View key={exp.id} style={s.entry}>
                    <View style={s.entryHeader}>
                      <Text style={s.entryTitle}>{exp.position}</Text>
                      <Text style={s.entryDate}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                    </View>
                    <Text style={s.entrySub}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</Text>
                    {exp.description && <Text style={s.text}>{stripHtml(exp.description)}</Text>}
                    {exp.achievements && <Text style={s.textSmall}>{stripHtml(exp.achievements)}</Text>}
                  </View>
                ))}
              </View>
            )}

            {educations.length > 0 && (
              <View style={s.mainSection}>
                <Text style={s.mainTitle}>Education</Text>
                {educations.map((edu) => (
                  <View key={edu.id} style={s.entry}>
                    <View style={s.entryHeader}>
                      <Text style={s.entryTitle}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</Text>
                      <Text style={s.entryDate}>{formatDateRange(edu.startDate, edu.endDate, edu.current)}</Text>
                    </View>
                    <Text style={s.entrySub}>{edu.institution}</Text>
                    {edu.gpa && <Text style={s.textSmall}>GPA: {edu.gpa}</Text>}
                  </View>
                ))}
              </View>
            )}

            {projects.length > 0 && (
              <View style={s.mainSection}>
                <Text style={s.mainTitle}>Projects</Text>
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

            {credentials.length > 0 && credentials.some((c) => c.certificateName) && (
              <View style={s.mainSection}>
                <Text style={s.mainTitle}>Certifications</Text>
                {credentials.filter((c) => c.certificateName).map((cred) => (
                  <Text key={cred.id} style={s.text}>{cred.certificateName} — {cred.issuer}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplateCreative;
